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
        dispatch("correct");
    }
</script>

<div class={"mb-4 " + class_}>
    {#each options as option}
        <Option
            {flip}
            hiddenText={option}
            revealedText={option}
            isCorrect={option === correctOption}
            on:correct={onCorrect}
            on:incorrect
        />
    {/each}
</div>
