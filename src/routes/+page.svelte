<script lang="ts">
import Textarea from '$lib/components/Textarea.svelte';
import { pemSchema } from '$lib/validators/pem';

const fields = $state({
        certificate: '',
        key: '',
        filename: '',
});

const certificateSchema = pemSchema('CERTIFICATE');
const keySchema = pemSchema('PRIVATE_KEY');

const certificateStatus = $derived.by(() => {
        if (fields.certificate === '') return undefined;
        const result = certificateSchema.safeParse(fields.certificate);

        if (!result.success) {
                return result.error.message;
        } else {
                return false;
        }
});

const keyStatus = $derived.by(() => {
        if (fields.key === '') return undefined;
        const result = keySchema.safeParse(fields.key);

        if (!result.success) {
                return result.error.message;
        } else {
                return false;
        }
});
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<form action="/api/bundle">
        <Textarea
                name="CERTIFICATE"
                bind:value={fields.certificate}
                error={certificateStatus} />
        <Textarea
                name="PRIVATE_KEY"
                bind:value={fields.key}
                error={keyStatus} />
        <input
                value={fields.filename}
                type="text"
                name="filename"
                placeholder="client_cert"
                aria-label="filename" />

        <input type="submit" value="Bundle" />
</form>

<style>
form {
        width: min(100%, 600px);
}
</style>
