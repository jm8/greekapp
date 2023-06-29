import { getInflectionWeight, getWordTypeWeight } from "./database";
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
    console.log({ cumulativeWeights, rand, i });
    if (i === -1) i = weights.length - 1;
    return options[i];
}

export async function getRandomWordTypeAndInflection(): Promise<{
    wordType: string;
    inflection: string;
}> {
    const wordTypes = Object.keys(ALL_WORDS);
    const wordTypeWeights = await Promise.all(wordTypes.map(getWordTypeWeight));
    const wordType = weightedRandom(wordTypes, wordTypeWeights);

    const inflections = getInflectionsForWordType(wordType);
    const inflectionWeights = await Promise.all(
        inflections.map((inflection) =>
            getInflectionWeight(wordType, inflection)
        )
    );
    const inflection = weightedRandom(inflections, inflectionWeights);
    return { wordType, inflection };
}
