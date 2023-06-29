import { get, set } from "idb-keyval";
import { getInflectionsForWordType } from "./words";
import { browser } from "$app/environment";

export const DEFAULT_WEIGHT = 4096;

export async function getInflectionWeight(
    wordType: string,
    inflection: string
): Promise<number> {
    const result = await get<number>(`weight.${wordType}.${inflection}`);
    if (result === undefined) {
        return DEFAULT_WEIGHT;
    }
    return result;
}

export async function getWordTypeWeight(wordType: string): Promise<number> {
    let result = 0;
    const inflections = getInflectionsForWordType(wordType);
    const weights = await Promise.all(
        inflections.map((inflection) =>
            getInflectionWeight(wordType, inflection)
        )
    );
    for (const weight of weights) {
        result += weight;
    }
    return result;
}

export async function updateWeight(
    wordType: string,
    inflection: string,
    correct: boolean
) {
    const originalWeight = await getInflectionWeight(wordType, inflection);
    const multiplier = correct ? 2 : 0.5;
    const newWeight = originalWeight * multiplier;
    await set(`weight.${wordType}.${inflection}`, newWeight);
}
