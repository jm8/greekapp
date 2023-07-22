<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let hiddenText: string;
    export let revealedText: string;
    export let isCorrect: boolean;
    export let flip: boolean;
    export let disabled = false;

    let clicked: boolean;

    const dispatch = createEventDispatcher();

    function onClick() {
        clicked = true;
        if (isCorrect) {
            dispatch("answered");
        } else {
            dispatch("incorrect");
        }
    }
</script>

{#if clicked || flip}
    <button
        class="m-2 p-2"
        class:bg-green-400={isCorrect}
        class:bg-red-400={clicked && !isCorrect}
        class:bg-gray-400={!clicked && !isCorrect}
        disabled
    >
        <div class="w-full text-center overflow-hidden overflow-ellipsis">
            {revealedText}
        </div>
    </button>
{:else}
    <button
        {disabled}
        class="bg-blue-400 hover:bg-blue-300 focus:bg-blue-300 m-2 p-2 disabled:opacity-50"
        on:click={onClick}
    >
        <div class="w-full text-center overflow-hidden overflow-ellipsis">
            {hiddenText}
        </div>
    </button>
{/if}
