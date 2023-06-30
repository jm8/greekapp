<script lang="ts">
    import Option from "./Option.svelte";

    // a map from inflection to word
    export let allInflections: { [inflection in string]: string };

    // the target word
    export let word: string;

    // used for updating weights
    export let wordType: string;
</script>

{#each Object.keys(allInflections) as inflection}
    <Option
        {allInflections}
        {inflection}
        {wordType}
        targetWord={word}
        text={inflection}
        on:correct
    />
{/each}
