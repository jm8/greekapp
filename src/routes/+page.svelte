<script lang="ts">
    import { randomWord as getRandomWord } from "$lib/words";
    import { onMount } from "svelte";
    import { getRandomWordTypeAndInflection } from "../lib/randomization";
    import { updateSkill } from "$lib/database";
    import Option from "$lib/Option.svelte";
    import OptionsNoun from "$lib/OptionsNoun.svelte";

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

{#if word}
    <h2>{word}</h2>
    {#key allInflections}
        <OptionsNoun
            on:correct={() => (answeredCorrectly = true)}
            {allInflections}
            {word}
            {wordType}
            flip={answeredCorrectly}
        />
    {/key}
    {#if answeredCorrectly}
        <button on:click={generateWord}>Next</button>
    {/if}
{/if}
