<script lang="ts">
    import { wordTypeFilterStore } from "./spacedrepetition";
    import { WORD_TYPES } from "./words";

    export let wordType: string;
    $: includedStore = wordTypeFilterStore(wordType);
</script>

{#if includedStore}
    <div class="flex flex-col gap-1">
        <label class="text-white text-lg">
            <input bind:checked={$includedStore} type="checkbox" />
            {wordType}
        </label>
        <div class="text-white">
            {Object.values(WORD_TYPES[wordType].words)
                .map((allInflections) => Object.values(allInflections)[0])
                .join(", ")}
        </div>
    </div>
{/if}
