<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import InflectionOption from "./InflectionOption.svelte";
    import RadioOptions from "./RadioOptions.svelte";
    import { WORD_TYPES, type VerbWordType } from "./words";

    // a map from inflection to word
    export let allInflections: { [inflection in string]: string };

    // the word
    export let word: string;

    // the form of the word we're going for
    export let wordType: string;

    $: wordTypeDefinition = WORD_TYPES[wordType] as VerbWordType;

    const verbInflections = [
        "singular_1st",
        "singular_2nd",
        "singular_3rd",
        "plural_1st",
        "plural_2nd",
        "plural_3rd",
    ];

    const dispatch = createEventDispatcher();

    let corrects = {
        voice: false,
        tense: false,
        inflection: false,
        mood: false,
    };

    function onCorrect(part: keyof typeof corrects) {
        corrects[part] = true;
        if (Object.values(corrects).every((v) => v)) {
            dispatch("answered");
        }
    }

    let alreadyDispatchedIncorrect = false;
    function onIncorrect() {
        if (!alreadyDispatchedIncorrect) {
            dispatch("incorrect");
        }
        alreadyDispatchedIncorrect = true;
    }
</script>

<RadioOptions
    class_="grid grid-cols-3"
    options={[
        "present",
        "future",
        "imperfect",
        "aorist",
        "perfect",
        "pluperfect",
    ]}
    on:incorrect={onIncorrect}
    on:answered={() => onCorrect("tense")}
    correctOption={wordTypeDefinition.tense}
/>

<RadioOptions
    class_="grid grid-cols-3"
    options={["active", "middle", "passive"]}
    on:answered={() => onCorrect("voice")}
    on:incorrect={onIncorrect}
    correctOption={wordTypeDefinition.voice}
/>

<RadioOptions
    class_="grid grid-cols-4"
    options={["indicative", "subjunctive", "optative", "imperative"]}
    on:answered={() => onCorrect("mood")}
    on:incorrect={onIncorrect}
    correctOption={wordTypeDefinition.mood}
/>

<div class="grid grid-rows-3 grid-cols-2 grid-flow-col">
    {#each verbInflections as inflection}
        <InflectionOption
            {allInflections}
            {inflection}
            flip={corrects.inflection}
            targetWord={word}
            on:answered={() => onCorrect("inflection")}
            on:incorrect={onIncorrect}
        />
    {/each}
</div>
