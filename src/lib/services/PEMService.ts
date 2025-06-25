import { error } from "@sveltejs/kit";

export type PEMType = "key" | "certificate"

export class PEMService {
        static validate(value: string, type: PEMType) {
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

        static validateOnServer(value: PEMType, url: URL) {
                const data = url.searchParams.get(value) ?? error(400, `Couldn't read ${value}`)
                const {invalid, error: valueError} = this.validate(data, value)
                if (invalid) {
                        console.error("Errored on: ", data)
                        error(400, `Invalid ${value} syntax: ${valueError}`)
                }

                return data
        }
}
