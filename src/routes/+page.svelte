<script lang="ts">
        import Textarea from "$lib/components/Textarea.svelte";

        const fields = $state({
                certificate: "",
                key: "",
                filename: "",
        });
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<form action="/api/bundle">
        <Textarea name="certificate" value={fields.certificate} />
        <Textarea name="key" value={fields.key} />
        <input
                value={fields.filename}
                type="text"
                name="filename"
                placeholder="client_cert.pfx"
                aria-label="filename"
        />

        <input type="submit" value="Bundle" />
</form>

<style>
        form {
                width: min(100%, 600px);
        }
</style>
