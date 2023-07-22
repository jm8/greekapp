<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import InflectionOption from "./InflectionOption.svelte";

    // a map from inflection to word
    export let allInflections: { [inflection in string]: string };

    // the target word
    export let word: string;

    let flip: boolean;

    const dispatch = createEventDispatcher();

    async function onCorrect() {
        flip = true;
        dispatch("answered");
    }

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
            {flip}
            targetWord={word}
            on:answered={onCorrect}
            on:incorrect
        />
    {/each}
</div>
