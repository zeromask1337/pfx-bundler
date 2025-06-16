<script lang="ts">
        import Textarea from "$lib/components/Textarea.svelte";

        const fields = $state({
                key: "",
                cert: "",
        });
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<Textarea name="key" value={fields.key} />
<Textarea name="cert" value={fields.cert} />
