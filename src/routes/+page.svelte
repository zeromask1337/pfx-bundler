<script lang="ts">
        import validatePEM from "$lib/validatePEM";

        const formData = $state({
                key: "",
                cert: "",
        });

        // Clean derived state using the single validation function
        let keyStatus = $derived(validatePEM(formData.key));
        let certStatus = $derived(validatePEM(formData.cert));
</script>

<h1>PEM Builder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<textarea
        bind:value={formData.key}
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

<textarea
        bind:value={formData.cert}
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
