<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Option from "./Option.svelte";

    // text shown before the button is clicked
    export let allInflections: { [inflection: string]: string };

    // the inflection of this option
    export let inflection: string;

    // the word we are going for
    export let targetWord: string;

    // whether to flip all (after you get it correctly before moving on).
    // in this case will be a neutral color
    export let flip = false;

    // whether to be disabled
    export let disabled = false;
</script>

<Option
    {flip}
    {disabled}
    isCorrect={allInflections[inflection] === targetWord}
    hiddenText={inflection}
    revealedText={allInflections[inflection]}
    on:answered
    on:incorrect
/>
