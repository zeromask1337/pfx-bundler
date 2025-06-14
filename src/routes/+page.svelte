<script lang="ts">
        import validatePEM from "$lib/validatePEM";

        const fields = $state({
                key: "",
                cert: "",
        });

        // Clean derived state using the single validation function
        let keyStatus = $derived(validatePEM(fields.key));
        let certStatus = $derived(validatePEM(fields.cert));
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<textarea
        bind:value={fields.key}
        name="key"
        aria-invalid={keyStatus.invalid}
        aria-describedby="key-helper"
        required
></textarea>
<small id="key-helper">
        {keyStatus.invalid === null
                ? "Enter your key"
                : keyStatus.invalid
                  ? keyStatus.error
                  : "Looks good!"}
</small>
<button
        onclick={() =>
                navigator.clipboard
                        .readText()
                        .then((value) => (fields.key = value))}>Paste</button
>

<textarea
        bind:value={fields.cert}
        name="certificate"
        aria-invalid={certStatus.invalid}
        aria-describedby="certificate-helper"
        required
></textarea>
<small id="certificate-helper">
        {certStatus.invalid === null
                ? "Enter your certificate"
                : certStatus.invalid
                  ? certStatus.error
                  : "Looks good!"}
</small>
