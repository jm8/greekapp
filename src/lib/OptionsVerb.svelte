<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import InflectionOption from "./InflectionOption.svelte";
    import RadioOptions from "./RadioOptions.svelte";
    import {
        WORD_TYPES,
        type VerbWordType,
        getInflectionsForWordType,
    } from "./words";

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
            // updateSkill(wordType, inflection, -1);
        }
    }

    function onIncorrect() {
        for (const inflection of getInflectionsForWordType(wordType)) {
            console.log("-1 ", wordType, inflection);
            // updateSkill(wordType, inflection, -1);
        }
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
    on:correct={() => onCorrect("tense")}
    correctOption={wordTypeDefinition.tense}
/>

<RadioOptions
    class_="grid grid-cols-3"
    options={["active", "middle", "passive"]}
    on:correct={() => onCorrect("voice")}
    on:incorrect={onIncorrect}
    correctOption={wordTypeDefinition.voice}
/>

<RadioOptions
    class_="grid grid-cols-4"
    options={["indicative", "subjunctive", "optative", "imperative"]}
    on:correct={() => onCorrect("mood")}
    on:incorrect={onIncorrect}
    correctOption={wordTypeDefinition.mood}
/>

<div class="grid grid-rows-3 grid-cols-2 grid-flow-col">
    {#each verbInflections as inflection}
        <InflectionOption
            {wordType}
            {allInflections}
            {inflection}
            flip={corrects.inflection}
            targetWord={word}
            on:correct={() => onCorrect("inflection")}
        />
    {/each}
</div>
