<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Option from "./Option.svelte";

    export let options: string[];
    export let correctOption: string;
    export let class_: string;

    let flip = false;

    const dispatch = createEventDispatcher();

    function onCorrect() {
        flip = true;
        dispatch("answered");
    }
</script>

<div class={"mb-4 " + class_}>
    {#each options as option}
        <Option
            {flip}
            hiddenText={option}
            revealedText={option}
            isCorrect={option === correctOption}
            on:answered={onCorrect}
            on:incorrect
        />
    {/each}
</div>
