import { getInflectionSkill } from "./database";
import { ALL_WORDS, getInflectionsForWordType } from "./words";

function weightedRandom<T>(options: T[], weights: number[]) {
    const cumulativeWeights: number[] = [];
    let sum = 0;
    for (const weight of weights) {
        sum += weight;
        cumulativeWeights.push(sum);
    }
    let rand = Math.random() * sum;
    let i = cumulativeWeights.findIndex((x) => x >= rand);
    if (i === -1) i = weights.length - 1;
    return options[i];
}

async function getInflectionWeight(wordType: string, inflection: string) {
    const skill = await getInflectionSkill(wordType, inflection);
    return 3 ** (20 - skill);
}

export async function getRandomWordTypeAndInflection(): Promise<{
    wordType: string;
    inflection: string;
}> {
    const wordTypes = Object.keys(ALL_WORDS);
    const wordTypesAndInflections = wordTypes.flatMap((wordType) =>
        getInflectionsForWordType(wordType).map((inflection) => ({
            wordType,
            inflection,
        }))
    );
    const weights = await Promise.all(
        wordTypesAndInflections.map(({ wordType, inflection }) =>
            getInflectionWeight(wordType, inflection)
        )
    );

    return weightedRandom(wordTypesAndInflections, weights);
}
