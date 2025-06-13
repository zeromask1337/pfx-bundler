<script lang="ts">
        let formData = $state({
                key: "",
                cert: "",
        });
        $inspect(formData);
        let keyStatus = $derived.by(validateKeyPEM);
        let certStatus = $derived.by(validateCertPEM);
        $inspect(keyStatus, certStatus);

        function validateKeyPEM() {
                let type;
                if (formData.key === "") return { invalid: null, error: null };

                if (typeof formData.key !== "string")
                        return { invalid: true, error: "Invalid input" };

                const trimmed: string = formData.key.trim();
                const lines: string[] = trimmed.split(/\r?\n/);

                // Check header
                const headerMatch = lines[0].match(
                        /^-----BEGIN ([A-Z\s]+)-----$/,
                );

                if (!headerMatch)
                        return {
                                invalid: true,
                                error: "Invalid header format",
                        };

                type = headerMatch[1];
                const expectedFooter: string = `-----END ${type}-----`;

                // Check footer
                if (lines[lines.length - 1] !== expectedFooter)
                        return {
                                invalid: true,
                                error: "Header/footer mismatch",
                        };

                // Validate base64 content
                const content: string = lines.slice(1, -1).join("");
                const base64Regex: RegExp = /^[A-Za-z0-9+/]*={0,2}$/;

                if (!base64Regex.test(content))
                        return {
                                invalid: true,
                                error: "Invalid base64 content",
                        };

                return {
                        invalid: false,
                        error: null,
                };
        }

        function validateCertPEM() {
                let type;
                if (formData.cert === "") return { invalid: null, error: null };

                if (typeof formData.cert !== "string")
                        return { invalid: true, error: "Invalid input" };

                const trimmed: string = formData.cert.trim();
                const lines: string[] = trimmed.split(/\r?\n/);

                // Check header
                const headerMatch = lines[0].match(
                        /^-----BEGIN ([A-Z\s]+)-----$/,
                );

                if (!headerMatch)
                        return {
                                invalid: true,
                                error: "Invalid header format",
                        };

                type = headerMatch[1];
                const expectedFooter: string = `-----END ${type}-----`;

                // Check footer
                if (lines[lines.length - 1] !== expectedFooter)
                        return {
                                invalid: true,
                                error: "Header/footer mismatch",
                        };

                // Validate base64 content
                const content: string = lines.slice(1, -1).join("");
                const base64Regex: RegExp = /^[A-Za-z0-9+/]*={0,2}$/;

                if (!base64Regex.test(content))
                        return {
                                invalid: true,
                                error: "Invalid base64 content",
                        };

                return {
                        invalid: false,
                        error: null,
                };
        }
</script>

<h1>PEM Bunlder</h1>
<p>Pass key and certificate to bundle them into PFX</p>

<textarea
        bind:value={formData.key}
        name="key"
        aria-invalid={keyStatus.invalid}
        aria-describedby="key-helper"
        required
>
</textarea>
<small id="key-helper">Looks good! {keyStatus.error} {keyStatus.invalid}</small>

<textarea
        bind:value={formData.cert}
        name="certificate"
        aria-invalid={!certStatus.invalid}
        aria-describedby="certificate-helper"
        required
>
</textarea>
<small id="certificate-helper"
        >Looks good! {certStatus.error} {certStatus.invalid}</small
>
