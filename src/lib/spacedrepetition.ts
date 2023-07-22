import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { WORD_TYPES, getInflectionsForWordType } from "./words";

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
        }
    }
    return db;
}

const db = await getDb();

export async function getNextWordTypeAndInflection() {
    const word = await db.getFromIndex(
        "words",
        "byDueDate",
        IDBKeyRange.upperBound(nowHour())
    );
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
