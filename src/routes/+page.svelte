<script lang="ts">
    import { randomWord as getRandomWord } from "$lib/words";
    import { onMount } from "svelte";
    import { getRandomWordTypeAndInflection } from "../lib/randomization";
    import { updateWeight } from "$lib/database";

    let word: string;
    let inflection: string;
    let wordType: string;

    async function generateWord() {
        const wordTypeAndInflection = await getRandomWordTypeAndInflection();
        wordType = wordTypeAndInflection.wordType;
        inflection = wordTypeAndInflection.inflection;
        word = getRandomWord(wordType, inflection);
    }

    async function nextWord(correct: boolean) {
        await updateWeight(inflection, wordType, correct);
        await generateWord();
    }

    onMount(generateWord);
</script>

{#if word}
    <h2>{word}</h2>

    <button on:click={() => nextWord(true)}>Correct</button>
    <button on:click={() => nextWord(false)}>Incorrect</button>
{/if}
