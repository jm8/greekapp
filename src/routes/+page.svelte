<script lang="ts">
    import { getNextWordTypesAndInflections } from "$lib/spacedrepetition";
</script>

<div class="w-full h-full max-w-4xl mx-auto flex flex-col justify-center">
    {#await getNextWordTypesAndInflections()}
        <a
            class="m-4 p-4 bg-green-400 hover:bg-green-300 focus:bg-green-300 text-black"
            href="/quiz">...</a
        >
    {:then nextWordTypesAndInflections}
        {#if nextWordTypesAndInflections.length === 0}
            <div class="m-4 p-4 bg-gray-400">All caught up!</div>
        {:else}
            <a
                class="m-4 p-4 bg-green-400 hover:bg-green-300 focus:bg-green-300 text-black"
                href="/quiz"
                >Start ({nextWordTypesAndInflections.length} cards remaining)</a
            >
        {/if}
    {/await}
    <a
        class="m-4 p-4 bg-blue-400 hover:bg-blue-300 focus:bg-blue-300"
        href="/settings">Settings</a
    >
</div>
