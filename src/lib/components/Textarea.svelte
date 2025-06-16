<script lang="ts">
        import validatePEM from "$lib/validatePEM";
        let { name, value } = $props();

        let status = $derived(validatePEM(value));
</script>

<textarea
        bind:value
        {name}
        aria-invalid={status.invalid}
        aria-describedby="key-helper"
        required
></textarea>
<small id="key-helper">
        {status.invalid === null
                ? `Enter your ${name}`
                : status.invalid
                  ? status.error
                  : `${name} looks good!`}
</small>
<button
        onclick={() =>
                navigator.clipboard
                        .readText()
                        .then((newValue) => (value = newValue))}>Paste</button
>
