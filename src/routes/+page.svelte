<script lang="ts">
import validatePEM from '$lib/validatePEM';

let key = $state('');
let keyIsValid = $state<null | boolean>(null);
let cert = $state('');
let keyIsValid = $state<null | boolean>(null);
</script>

<h1>PEM Bunlder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<textarea
        bind:value={() => key, (v) => validatePEM(v)}
        name="key"
        aria-invalid="false"
        aria-describedby="key-helper"
        required
>
</textarea>
<small id="key-helper">Looks good!</small>

<textarea
        bind:value={() => cert, (v) => validatePEM(v)}
        name="certificate"
        aria-invalid={null}
        aria-describedby="certificate-helper"
        required
>
</textarea>
<small id="certificate-helper">Looks good!</small>
