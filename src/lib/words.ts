type NounInflections = {
    singular_nominative: string;
    singular_genitive: string;
    singular_dative: string;
    singular_accusative: string;
    plural_nominative: string;
    plural_genitive: string;
    plural_dative: string;
    plural_accusative: string;
};

type VerbInflections = {
    singular_1st: string;
    singular_2nd: string;
    singular_3rd: string;
    plural_1st: string;
    plural_2nd: string;
    plural_3rd: string;
};

type Gender = "masculine" | "feminine" | "neuter";
type Voice = "active" | "middle" | "passive" | "middlepassive";
type Tense =
    | "present"
    | "future"
    | "imperfect"
    | "aorist"
    | "perfect"
    | "pluperfect";

type Mood = "indicative" | "subjunctive" | "optative" | "imperative";

export type NounWordType = {
    partOfSpeech: "noun";
    gender: Gender;
    words: NounInflections[];
};

export type VerbWordType = {
    partOfSpeech: "verb";
    voice: Voice;
    tense: Tense;
    mood: Mood;
    words: VerbInflections[];
};

export type WordType = NounWordType | VerbWordType;

type WordTypes = {
    [key in string]: WordType;
};

export const WORD_TYPES: WordTypes = {
    noun_1st_declension: {
        partOfSpeech: "noun",
        gender: "feminine",
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
    noun_1st_declension_alpha: {
        partOfSpeech: "noun",
        gender: "feminine",
        words: [
            {
                singular_nominative: "καρδία",
                singular_genitive: "καρδίας",
                singular_dative: "καρδίᾳ",
                singular_accusative: "καρδίαν",
                plural_nominative: "καρδίαι",
                plural_genitive: "καρδιῶν",
                plural_dative: "καρδίαις",
                plural_accusative: "καρδίας",
            },
        ],
    },
    noun_2nd_declension: {
        partOfSpeech: "noun",
        gender: "masculine",
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
    eimi_present_active_indicative: {
        partOfSpeech: "verb",
        tense: "present",
        voice: "active",
        mood: "indicative",
        words: [
            {
                singular_1st: "εἰμῐ",
                singular_2nd: "εἶ",
                singular_3rd: "ἐστί(ν)",
                plural_1st: "ἐσμέν",
                plural_2nd: "ἐστέ",
                plural_3rd: "εἰσί(ν)",
            },
        ],
    },
    eimi_imperfect_active_indicative: {
        partOfSpeech: "verb",
        voice: "active",
        tense: "imperfect",
        mood: "indicative",
        words: [
            {
                singular_1st: "ἤμην",
                singular_2nd: "ἦς",
                singular_3rd: "ἦν",
                plural_1st: "ἦμεν",
                plural_2nd: "ἦτε",
                plural_3rd: "ἦσαν",
            },
        ],
    },
    eimi_future_middle_indicative: {
        partOfSpeech: "verb",
        voice: "middle",
        tense: "future",
        mood: "indicative",
        words: [
            {
                singular_1st: "ἔσομαι",
                singular_2nd: "ἔσῃ",
                singular_3rd: "ἔσται",
                plural_1st: "ἐσόμεθα",
                plural_2nd: "ἔσεσθε",
                plural_3rd: "ἔσονται",
            },
        ],
    },
    eimi_present_active_subjunctive: {
        partOfSpeech: "verb",
        voice: "active",
        tense: "present",
        mood: "subjunctive",
        words: [
            {
                singular_1st: "ὦ",
                singular_2nd: "ᾖς",
                singular_3rd: "ᾖ",
                plural_1st: "ὦμεν",
                plural_2nd: "ἦτε",
                plural_3rd: "ὦσι(ν)",
            },
        ],
    },
    mi_present_active_indicate: {
        partOfSpeech: "verb",
        voice: "active",
        tense: "present",
        mood: "indicative",
        words: [
            {
                singular_1st: "δῐ́δωμῐ",
                singular_2nd: "δῐ́δως",
                singular_3rd: "δῐ́δωσῐν",
                plural_1st: "δῐ́δομεν",
                plural_2nd: "δῐ́δοτε",
                plural_3rd: "δῐδόᾱσῐν",
            },
        ],
    },
    mi_aorist_active_indicative: {
        partOfSpeech: "verb",
        voice: "active",
        tense: "aorist",
        mood: "indicative",
        words: [
            {
                plural_1st: "δώκᾰμεν",
                plural_2nd: "δώκᾰτε",
                plural_3rd: "δῶκᾰν",
                singular_1st: "δῶκᾰ",
                singular_2nd: "δῶκᾰς",
                singular_3rd: "δῶκεν",
            },
        ],
    },
};

export function randomWord(wordType: string) {
    const words = WORD_TYPES[wordType].words;
    const i = Math.floor(Math.random() * words.length);
    const word = words[i];
    return word;
}

export function getInflectionsForWordType(wordType: string): string[] {
    return Object.keys(WORD_TYPES[wordType].words[0]);
}
