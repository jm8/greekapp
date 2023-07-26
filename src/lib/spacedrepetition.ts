import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { WORD_TYPES, getInflectionsForWordType } from "./words";
import { writable, type Writable } from "svelte/store";
import shuffle from "shuffle-array";

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

let _db: IDBPDatabase<SpacedRepetition> | undefined = undefined;

export async function getDb() {
    if (_db) return _db;
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
    _db = db;
    return db;
}

async function filterAsync<T>(
    xs: T[],
    f: (x: T) => Promise<boolean>
): Promise<T[]> {
    const result = [];
    for (const x of xs) {
        if (await f(x)) {
            result.push(x);
        }
    }
    return result;
}

export async function getNextWordTypesAndInflections() {
    const db = await getDb();
    const wordsDue = await db.getAllFromIndex(
        "words",
        "byDueDate",
        IDBKeyRange.upperBound(nowHour())
    );
    // todo: performance?
    shuffle(wordsDue);
    const words = await filterAsync(wordsDue, async (word) => {
        const filter = await db.get(
            "wordTypeFilters",
            word.wordTypeAndInflection.split(".")[0]
        );
        return filter?.included ?? false;
    });
    const wordTypesAndInflections = words.map(
        ({ dueDate, interval, wordTypeAndInflection }) => {
            const [wordType, inflection] = wordTypeAndInflection.split(".");
            return { wordType, inflection, dueDate, interval };
        }
    );

    return wordTypesAndInflections;
}

export async function getNextWordTypeAndInflection() {
    const nextWordTypesAndInflections = await getNextWordTypesAndInflections();
    if (nextWordTypesAndInflections.length === 0) {
        return undefined;
    }
    return nextWordTypesAndInflections[0];
}

export async function markCorrect(wordType: string, inflection: string) {
    const db = await getDb();
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
    return { wordType, inflection, interval: newInterval, dueDate: newDueDate };
}

export async function markIncorrect(wordType: string, inflection: string) {
    const db = await getDb();
    const word = await db.get("words", `${wordType}.${inflection}`);
    if (!word) {
        throw "BBB";
    }
    const newInterval = word.interval * 0.5;
    const newDueDate = nowHour() + word.interval;
    db.put("words", {
        wordTypeAndInflection: `${wordType}.${inflection}`,
        dueDate: newDueDate,
        interval: newInterval,
    });
    return { wordType, inflection, interval: newInterval, dueDate: newDueDate };
}

export function wordTypeFilterStore(wordType: string): Writable<boolean> {
    const store = writable(false);
    (async () => {
        const db = await getDb();
        const wordTypeFilter = await db.get("wordTypeFilters", wordType);
        store.set(wordTypeFilter?.included ?? false);
    })();

    store.subscribe(async (newIncluded) => {
        (await getDb()).put("wordTypeFilters", {
            wordType,
            included: newIncluded,
        });
    });
    return store;
}
