<script lang="ts">
    import { WORD_TYPES, randomWord as getRandomWord } from "$lib/words";
    import { onMount } from "svelte";
    import {
        getNextWordTypeAndInflection,
        markCorrect,
        markIncorrect,
    } from "$lib/spacedrepetition";
    import OptionsNoun from "$lib/OptionsNoun.svelte";
    import OptionsVerb from "$lib/OptionsVerb.svelte";

    let allInflections: { [inflection in string]: string };
    let wordType: string;
    let word: string;
    let correct = true;
    let answered = false;

    async function generateWord() {
        const randomized = await getNextWordTypeAndInflection();
        if (!randomized) {
            throw "AAA";
        }
        answered = false;
        correct = true;
        allInflections = getRandomWord(randomized.wordType);
        wordType = randomized.wordType;
        word = allInflections[randomized.inflection];
    }
    onMount(generateWord);

    async function onAnswered() {
        answered = true;
        if (correct) {
            for (const inflection of Object.keys(allInflections)) {
                if (allInflections[inflection] === word) {
                    await markCorrect(wordType, inflection);
                }
            }
        }
    }

    async function onIncorrect() {
        correct = false;
        for (const inflection of Object.keys(allInflections)) {
            if (allInflections[inflection] === word) {
                await markIncorrect(wordType, inflection);
            }
        }
    }
</script>

<div class="w-full h-full max-w-4xl mx-auto flex flex-col">
    {#if word}
        <h2 class="p-4 text-3xl text-center text-white">{word}</h2>
        <div class="flex-1 flex flex-col justify-center">
            {#key allInflections}
                {#if WORD_TYPES[wordType].partOfSpeech === "noun"}
                    <OptionsNoun
                        on:answered={onAnswered}
                        on:incorrect={onIncorrect}
                        {allInflections}
                        {word}
                    />
                {:else if WORD_TYPES[wordType].partOfSpeech === "verb"}
                    <OptionsVerb
                        on:answered={onAnswered}
                        on:incorrect={onIncorrect}
                        {allInflections}
                        {word}
                        {wordType}
                    />
                {/if}
            {/key}
        </div>
    {/if}
    <button
        style:visibility={answered ? "visible" : "hidden"}
        class="m-4 p-4 bg-green-400 hover:bg-green-300 focus:bg-green-300"
        on:click={generateWord}>Next</button
    >
</div>
