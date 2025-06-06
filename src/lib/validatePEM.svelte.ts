export interface PEMValidationResult {
        valid: boolean;
        error?: string;
        type?: string;
}

export default function validatePEM(pemString: string): PEMValidationResult {
        if (!pemString || typeof pemString !== 'string') {
                return { valid: false, error: 'Invalid input' };
        }

        const trimmed: string = pemString.trim();
        const lines: string[] = trimmed.split(/\r?\n/);

        if (lines.length < 3) {
                return { valid: false, error: 'Too few lines' };
        }

        // Check header
        const headerMatch: RegExpMatchArray | null = lines[0].match(
                /^-----BEGIN ([A-Z\s]+)-----$/,
        );
        if (!headerMatch) {
                return { valid: false, error: 'Invalid header format' };
        }

        const type: string = headerMatch[1];
        const expectedFooter: string = `-----END ${type}-----`;

        // Check footer
        if (lines[lines.length - 1] !== expectedFooter) {
                return { valid: false, error: 'Header/footer mismatch' };
        }

        // Validate base64 content
        const content: string = lines.slice(1, -1).join('');
        const base64Regex: RegExp = /^[A-Za-z0-9+/]*={0,2}$/;

        if (!base64Regex.test(content)) {
                return { valid: false, error: 'Invalid base64 content' };
        }

        return { valid: true, type };
}

