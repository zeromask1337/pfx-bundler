interface ValidationResult {
        invalid: boolean | null;
        error: string | null;
}

export type PEMType = "key" | "certificate"

export default function validatePEM(value: string, type: PEMType): ValidationResult {
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
        console.log("This is header match", headerMatch)
        if (!headerMatch[1].includes(type.toUpperCase())) {
                return {
                        invalid: true,
                        error: `Header title should correspond to type ${type}`
                }
        }

        const headerType = headerMatch[1];
        const expectedFooter = `-----END ${headerType}-----`;

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

