<script>
    import WordTypeFilter from "$lib/WordTypeFilter.svelte";
    import { WORD_TYPES } from "$lib/words";
</script>

<div class="w-full h-full max-w-4xl mx-auto flex flex-col px-4 py-4 gap-4">
    <a class="text-white" href="/">Back</a>
    {#each Object.keys(WORD_TYPES) as wordType}
        <WordTypeFilter {wordType} />
    {/each}
</div>
