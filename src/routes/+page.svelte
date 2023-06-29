<script lang="ts">
    import { getRandomWordTypeAndInflection } from "../lib/weights";

    let x = "click for random";
</script>

<button
    on:click={() => {
        const y = getRandomWordTypeAndInflection();
        x = JSON.stringify(y);
    }}>{x}</button
>
