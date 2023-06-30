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
        clicked = true;
        if (correct) {
            for (const [otherInflection, otherWord] of Object.entries(
                allInflections
            )) {
                if (otherWord === targetWord) {
                    await updateSkill(wordType, otherInflection, 1);
                }
            }
            dispatch("correct");
        } else {
            await updateSkill(wordType, inflection, -1);
            for (const [otherInflection, otherWord] of Object.entries(
                allInflections
            )) {
                if (otherWord === targetWord) {
                    await updateSkill(wordType, otherInflection, -1);
                }
            }
        }
    }
</script>

{#if clicked || flip}
    <button
        class="m-4 p-4"
        class:bg-green-400={correct}
        class:bg-red-400={clicked && !correct}
        class:bg-gray-400={!clicked && !correct}
        disabled
    >
        {allInflections[inflection]}
    </button>
{:else}
    <button class="bg-blue-400 hover:bg-blue-300 m-4 p-4" on:click={onClick}
        >{text}</button
    >
{/if}
