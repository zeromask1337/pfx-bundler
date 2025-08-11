<script lang="ts">
        import { PEMService, type PEMType } from "$lib/services/PEMService";

        interface Props {
                value: string;
                name: PEMType;
        }

        let { value, name }: Props = $props();

        let status = $derived(PEMService.validate(value, name));
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
                type="button"
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
