<script lang="ts">
    import { WORD_TYPES, randomWord as getRandomWord } from "$lib/words";
    import { onMount } from "svelte";
    import { getRandomWordTypeAndInflection } from "../lib/randomization";
    import OptionsNoun from "$lib/OptionsNoun.svelte";
    import OptionsVerb from "$lib/OptionsVerb.svelte";

    let allInflections: { [inflection in string]: string };
    let wordType: string;
    let word: string;
    let answeredCorrectly = false;

    async function generateWord() {
        const randomized = await getRandomWordTypeAndInflection();
        answeredCorrectly = false;
        allInflections = getRandomWord(randomized.wordType);
        wordType = randomized.wordType;
        word = allInflections[randomized.inflection];
    }
    onMount(generateWord);
</script>

<div class="flex flex-col">
    {#if word}
        <h2 class="p-4 text-3xl text-center text-white">{word}</h2>
        {#key allInflections}
            {#if WORD_TYPES[wordType].partOfSpeech === "noun"}
                <OptionsNoun
                    on:correct={() => (answeredCorrectly = true)}
                    {allInflections}
                    {word}
                    {wordType}
                    flip={answeredCorrectly}
                />
            {:else if WORD_TYPES[wordType].partOfSpeech === "verb"}
                <OptionsVerb
                    on:correct={() => (answeredCorrectly = true)}
                    {allInflections}
                    {word}
                    {wordType}
                    flip={answeredCorrectly}
                />
            {/if}
        {/key}
        {#if answeredCorrectly}
            <button
                class="m-4 p-4 bg-green-400 hover:bg-green-300 focus:bg-green-300"
                on:click={generateWord}>Next</button
            >
        {/if}
    {/if}
</div>
