<script lang="ts">
        import Textarea from "$lib/components/Textarea.svelte";

        const fields = $state({
                certificate: "",
                key: "",
        });
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<form action="/api/bundle">
        <Textarea name="certificate" value={fields.certificate} />
        <Textarea name="key" value={fields.key} />

        <input type="submit" value="Bundle" />
</form>

<style>
        form {
                width: min(100%, 600px);
        }
</style>
