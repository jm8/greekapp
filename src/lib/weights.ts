import wordTypesDatabase from "./words";

type Weights = {
    [wordType: string]: {
        [inflection: string]: number;
    };
};

const weightsDatabase: Weights = {
    noun_1st_declension: {
        singular_nominative: 1,
        singular_genitive: 1,
        singular_dative: 1,
        singular_accusative: 1,
        plural_nominative: 1,
        plural_genitive: 1,
        plural_dative: 1,
        plural_accusative: 1,
    },
    noun_2nd_declension: {
        singular_nominative: 1,
        singular_genitive: 1,
        singular_dative: 1,
        singular_accusative: 1,
        plural_nominative: 1,
        plural_genitive: 1,
        plural_dative: 1,
        plural_accusative: 1,
    },
};

function sum(arr: number[]) {
    let x = 0;
    for (const n of arr) {
        x += n;
    }
    return x;
}

export function getWordTypeWeight(wordType: string) {
    return sum(Object.values(weightsDatabase[wordType]));
}

export function getInflectionWeight(wordType: string, inflection: string) {
    return weightsDatabase[wordType][inflection];
}

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

export function getRandomWordTypeAndInflection() {
    const wordTypes = Object.keys(weightsDatabase);
    const wordTypeWeights = wordTypes.map(getWordTypeWeight);
    const wordType = weightedRandom(wordTypes, wordTypeWeights);

    const inflections = Object.keys(weightsDatabase[wordType]);
    const inflectionWeights = inflections.map((inflection) =>
        getInflectionWeight(wordType, inflection)
    );
    const inflection = weightedRandom(inflections, inflectionWeights);
    return { wordType, inflection };
}
