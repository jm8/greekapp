import { openDB, type DBSchema } from "idb";
import { WORD_TYPES, getInflectionsForWordType } from "./words";
import { writable, type Writable } from "svelte/store";

interface SpacedRepetition extends DBSchema {
    words: {
        value: {
            wordTypeAndInflection: `${string}.${string}`;
            interval: number;
            dueDate: number;
        };
        key: string;
        indexes: { byDueDate: number };
    };
    wordTypeFilters: {
        value: {
            wordType: string;
            included: boolean;
        };
        key: string;
    };
}

function nowHour() {
    return Number(new Date()) * 2.77778e-7;
}

export async function getDb() {
    const db = await openDB<SpacedRepetition>("spaced_repetition", 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            const wordsStore = db.createObjectStore("words", {
                keyPath: "wordTypeAndInflection",
            });
            db.createObjectStore("wordTypeFilters", {
                keyPath: "wordType",
            });
            wordsStore.createIndex("byDueDate", "dueDate");
        },
    });
    for (const wordType of Object.keys(WORD_TYPES)) {
        for (const inflection of getInflectionsForWordType(wordType)) {
            const definition = await db.get(
                "words",
                `${wordType}.${inflection}`
            );
            if (!definition) {
                await db.add("words", {
                    wordTypeAndInflection: `${wordType}.${inflection}`,
                    dueDate: nowHour(),
                    interval: 8,
                });
            }
            const filter = await db.get("wordTypeFilters", wordType);
            if (!filter) {
                await db.add("wordTypeFilters", {
                    wordType,
                    included: false,
                });
            }
        }
    }
    return db;
}

const db = await getDb();

async function findAsync<T>(
    xs: T[],
    f: (x: T) => Promise<boolean>
): Promise<T | undefined> {
    for (const x of xs) {
        if (await f(x)) {
            return x;
        }
    }
    return undefined;
}

export async function getNextWordTypeAndInflection() {
    const wordsDue = await db.getAllFromIndex(
        "words",
        "byDueDate",
        IDBKeyRange.upperBound(nowHour())
    );
    const word = await findAsync(wordsDue, async (word) => {
        const filter = await db.get(
            "wordTypeFilters",
            word.wordTypeAndInflection.split(".")[0]
        );
        return filter?.included ?? false;
    });
    if (!word) {
        return undefined;
    }
    const [wordType, inflection] = word.wordTypeAndInflection.split(".");
    return { wordType, inflection };
}

export async function markCorrect(wordType: string, inflection: string) {
    const word = await db.get("words", `${wordType}.${inflection}`);
    if (!word) {
        throw "BBB";
    }
    const newInterval = word.interval * 1.5;
    const newDueDate = nowHour() + word.interval;
    console.log(
        "Correct: ",
        wordType,
        inflection,
        word.interval,
        "->",
        newInterval
    );
    db.put("words", {
        wordTypeAndInflection: `${wordType}.${inflection}`,
        dueDate: newDueDate,
        interval: newInterval,
    });
    return { wordType, inflection };
}

export async function markIncorrect(wordType: string, inflection: string) {
    const word = await db.get("words", `${wordType}.${inflection}`);
    if (!word) {
        throw "BBB";
    }
    const newInterval = word.interval * 0.5;
    const newDueDate = nowHour() + word.interval;
    console.log(
        "Incorrect: ",
        wordType,
        inflection,
        word.interval,
        "->",
        newInterval
    );
    db.put("words", {
        wordTypeAndInflection: `${wordType}.${inflection}`,
        dueDate: newDueDate,
        interval: newInterval,
    });
    return { wordType, inflection };
}

export function wordTypeFilterStore(wordType: string): Writable<boolean> {
    if (!wordType) {
        console.log("wordType undefined");
    }
    const store = writable(false);
    db.get("wordTypeFilters", wordType)?.then((wordTypeFilter) => {
        store.set(wordTypeFilter?.included ?? false);
    });
    store.subscribe((newIncluded) => {
        db.put("wordTypeFilters", { wordType, included: newIncluded });
    });
    return store;
}
