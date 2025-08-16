<script lang="ts">
import Textarea from '$lib/components/Textarea.svelte';
import { pemSchema } from '$lib/validators/pem';

const fields = $state({
        certificate: {
                value: '',
                schema: pemSchema('CERTIFICATE'),
        },
        key: {
                value: '',
                schema: pemSchema('PRIVATE_KEY'),
        },
        filename: '',
});

const certificateStatus = $derived.by(parseField('certificate'));
const keyStatus = $derived.by(parseField('key'));

function parseField(type: 'certificate' | 'key') {
        return () => {
                if (fields[type].value === '') return;

                const result = fields[type].schema.safeParse(
                        fields[type].value,
                );

                if (!result.success) {
                        return {
                                invalid: true,
                                message: result.error.issues[0].message,
                        };
                } else {
                        return {
                                invalid: false,
                                message: `${type} looks good`,
                        };
                }
        };
}
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<form action="/api/bundle">
        <Textarea
                name="CERTIFICATE"
                bind:value={fields.certificate.value}
                error={certificateStatus} />
        <Textarea
                name="PRIVATE_KEY"
                bind:value={fields.key.value}
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
