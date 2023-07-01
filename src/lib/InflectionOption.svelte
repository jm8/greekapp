<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { updateSkill } from "./database";
    import Option from "./Option.svelte";

    // text shown before the button is clicked
    export let allInflections: { [inflection: string]: string };

    // the inflection of this option
    export let inflection: string;

    // the word we are going for
    export let targetWord: string;

    // the word type (used to update the skill on click)
    export let wordType: string;

    const dispatch = createEventDispatcher();

    $: correct = allInflections[inflection] == targetWord;

    // whether to flip all (after you get it correctly before moving on).
    // in this case will be a neutral color
    export let flip = false;

    // whether to be disabled
    export let disabled = false;

    // whether the button has been clicked. it can only be clicked once
    let clicked: boolean;

    async function onCorrect() {
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
        }
    }

    async function onIncorrect() {
        await updateSkill(wordType, inflection, -1);
        for (const [otherInflection, otherWord] of Object.entries(
            allInflections
        )) {
            if (otherWord === targetWord) {
                await updateSkill(wordType, otherInflection, -1);
            }
        }
    }
</script>

<Option
    {flip}
    {disabled}
    isCorrect={allInflections[inflection] === targetWord}
    hiddenText={inflection}
    revealedText={allInflections[inflection]}
    on:correct={onCorrect}
    on:incorrect={onIncorrect}
/>
