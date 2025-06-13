<script lang="ts">
        interface ValidationResult {
                invalid: boolean | null;
                error: string | null;
        }

        const formData = $state({
                key: "",
                cert: "",
        });

        function validatePEM(value: string): ValidationResult {
                if (value === "") return { invalid: null, error: null };

                if (typeof value !== "string") {
                        return { invalid: true, error: "Invalid input" };
                }

                const trimmed = value.trim();
                const lines = trimmed.split(/\r?\n/);

                // Check header
                const headerMatch = lines[0].match(
                        /^-----BEGIN ([A-Z\s]+)-----$/,
                );
                if (!headerMatch) {
                        return {
                                invalid: true,
                                error: "Invalid header format",
                        };
                }

                const type = headerMatch[1];
                const expectedFooter = `-----END ${type}-----`;

                // Check footer
                if (lines[lines.length - 1] !== expectedFooter) {
                        return {
                                invalid: true,
                                error: "Header/footer mismatch",
                        };
                }

                // Validate base64 content
                const content = lines.slice(1, -1).join("");
                const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

                if (!base64Regex.test(content)) {
                        return {
                                invalid: true,
                                error: "Invalid base64 content",
                        };
                }

                return { invalid: false, error: null };
        }

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
