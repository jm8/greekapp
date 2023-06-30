<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { getInflectionSkill, updateSkill } from "./database";

    // text shown before the button is clicked
    export let allInflections: { [inflection: string]: string };

    // the inflection of this option
    export let inflection: string;

    // the word we are going for
    export let targetWord: string;

    // the word type (used to update the skill on click)
    export let wordType: string;

    // the text to show when not clicked
    export let text: string;

    const dispatch = createEventDispatcher();

    $: correct = allInflections[inflection] == targetWord;

    // whether to flip all (after you get it correctly before moving on).
    // in this case will be a neutral color
    export let flip = false;

    // whether the button has been clicked. it can only be clicked once
    let clicked: boolean;

    async function onClick() {
        await updateSkill(wordType, inflection, correct);
        clicked = true;
        if (correct) {
            dispatch("correct");
        }
    }
</script>

{#if clicked || flip}
    <button disabled>
        {allInflections[inflection]}
        {#await getInflectionSkill(wordType, inflection) then skill}
            {#if clicked && correct}
                {skill - 1} &rarr; {skill}
            {:else if clicked && !correct}
                {skill + 1} &rarr; {skill}
            {:else}
                {skill}
            {/if}
        {/await}
    </button>
{:else}
    <button on:click={onClick}>{text}</button>
{/if}
