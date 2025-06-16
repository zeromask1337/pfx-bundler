<script lang="ts">
        import validatePEM from "$lib/validatePEM";
        let { name, value } = $props();

        let status = $derived(validatePEM(value));
</script>

<label
        >Enter {name}<textarea
                bind:value
                {name}
                placeholder="Paste your {name}"
                aria-invalid={status.invalid}
                aria-describedby={`${name}-helper`}
                required
        ></textarea>

        <small id={`${name}-helper`}>
                {status.invalid === null
                        ? null
                        : status.invalid
                          ? status.error
                          : `${name} looks good!`}
        </small>
        <button
                onclick={() =>
                        navigator.clipboard
                                .readText()
                                .then((newValue) => (value = newValue))}
                >Paste</button
        >
</label>

<style>
        label {
                margin-bottom: 50px;
        }

        textarea {
                min-height: 300px;
        }
</style>
