<script lang="ts">
        import validatePEM from "$lib/validatePEM";
        let { name, value } = $props();

        let status = $derived(validatePEM(value));
</script>

<label
        >{name}<textarea
                bind:value
                {name}
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
</label>
<button
        onclick={() =>
                navigator.clipboard
                        .readText()
                        .then((newValue) => (value = newValue))}
        >Paste {name}</button
>
