<script lang="ts">
import type { PEMHeader } from '$lib/validators/pem';

interface Props {
        value: string;
        name: PEMHeader;
        error:
                | {
                          invalid: boolean;
                          message: string;
                  }
                | undefined;
}

let { value = $bindable(), name, error }: Props = $props();
</script>

<label
        >Enter {name}<textarea
                bind:value
                {name}
                placeholder="Paste your {name}"
                aria-invalid={error?.invalid ?? null}
                aria-describedby={`${name}-helper`}
                required></textarea>

        <small id={`${name}-helper`}>
                {error || `${name} looks good!`}
        </small>
        <button
                type="button"
                onclick={() =>
                        navigator.clipboard
                                .readText()
                                .then((newValue) => (value = newValue))}
                >Paste</button>
</label>

<style>
label {
        margin-bottom: 50px;
}

textarea {
        min-height: 300px;
}
</style>
