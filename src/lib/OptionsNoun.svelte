<script lang="ts">
    import InflectionOption from "./InflectionOption.svelte";

    // a map from inflection to word
    export let allInflections: { [inflection in string]: string };

    // the target word
    export let word: string;

    // used for updating skills
    export let wordType: string;

    // whether to flip all (after you get it correctly before moving on).
    // in this case will be a neutral color
    export let flip = false;

    const nounInflections = [
        "singular_nominative",
        "singular_genitive",
        "singular_dative",
        "singular_accusative",
        "plural_nominative",
        "plural_genitive",
        "plural_dative",
        "plural_accusative",
    ];
</script>

<div class="grid grid-rows-4 grid-cols-2 grid-flow-col">
    {#each nounInflections as inflection}
        <InflectionOption
            {allInflections}
            {inflection}
            {wordType}
            {flip}
            targetWord={word}
            on:correct
        />
    {/each}
</div>
