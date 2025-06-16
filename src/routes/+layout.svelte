<script>
        let { children } = $props();
</script>

{@render children()}

<style>
        :global(body) {
                min-height: 100vh;
                display: flex;
                flex-flow: column;
                align-items: center;
        }

        :global(*) {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
        }
</style>
