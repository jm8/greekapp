type Noun = {
    singular_nominative: string;
    singular_genitive: string;
    singular_dative: string;
    singular_accusative: string;
    plural_nominative: string;
    plural_genitive: string;
    plural_dative: string;
    plural_accusative: string;
};

type WordType = {
    type: "noun";
    name: string;
    words: Noun[];
};

type WordTypes = {
    [key in string]: WordType;
};

export const ALL_WORDS: WordTypes = {
    noun_1st_declension: {
        type: "noun",
        name: "Noun: 1st Declension, Feminine",
        words: [
            {
                singular_nominative: "φωνή",
                singular_genitive: "φωνῆς",
                singular_dative: "φωνῇ",
                singular_accusative: "φωνήν",
                plural_nominative: "φωναί",
                plural_genitive: "φωνῶν",
                plural_dative: "φωναῖς",
                plural_accusative: "φωνάς",
            },
        ],
    },
    noun_2nd_declension: {
        type: "noun",
        name: "Noun: 2nd Declension, Masculine",
        words: [
            {
                singular_nominative: "λόγος",
                singular_genitive: "λόγου",
                singular_dative: "λόγῳ",
                singular_accusative: "λόγον",
                plural_nominative: "λόγοι",
                plural_genitive: "λόγων",
                plural_dative: "λόγοις",
                plural_accusative: "λόγους",
            },
        ],
    },
};

export function randomWord(wordType: string, inflection: string) {
    const words = ALL_WORDS[wordType].words;
    const i = Math.floor(Math.random() * words.length);
    const word = words[i];
    return (word as { [inflection in string]: string })[inflection];
}

export function getInflectionsForWordType(wordType: string): string[] {
    return Object.keys(ALL_WORDS[wordType].words[0]);
}
