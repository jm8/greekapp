<script lang="ts">
    import Option from "./Option.svelte";

    // a map from inflection to word
    export let allInflections: { [inflection in string]: string };

    // the target word
    export let word: string;

    // used for updating skills
    export let wordType: string;

    // whether to flip all (after you get it correctly before moving on).
    // in this case will be a neutral color
    export let flip = false;
</script>

{#each Object.keys(allInflections) as inflection}
    <Option
        {allInflections}
        {inflection}
        {wordType}
        {flip}
        targetWord={word}
        text={inflection}
        on:correct
    />
{/each}
