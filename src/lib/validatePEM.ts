export interface PEMValidationResult {
        valid: boolean | null;
        error?: string;
        type?: string | null;
}

export default function validatePEM(input: string): PEMValidationResult {
        let valid = null
        const type = ''
        let error = ''

        // if (!pemString || typeof pemString !== 'string') {
        //         valid = false
        //         error = 'Invalid input'
        // }
        //
        // const trimmed: string = pemString().trim();
        // const lines: string[] = trimmed.split(/\r?\n/);
        //
        // if (lines.length < 3) {
        //         valid = false
        //         error = 'Too few lines'
        // }
        //
        // // Check header
        // const headerMatch: RegExpMatchArray | null = lines[0].match(
        //         /^-----BEGIN ([A-Z\s]+)-----$/,
        // );
        // if (!headerMatch) {
        //         valid = false
        //         error = 'Invalid header format'
        // }
        //
        // type = headerMatch[1] ?? 0;
        // const expectedFooter: string = `-----END ${type}-----`;
        //
        // // Check footer
        // if (lines[lines.length - 1] !== expectedFooter) {
        //         valid = false
        //         error = 'Header/footer mismatch'
        // }
        //
        // // Validate base64 content
        // const content: string = lines.slice(1, -1).join('');
        // const base64Regex: RegExp = /^[A-Za-z0-9+/]*={0,2}$/;
        //
        // if (!base64Regex.test(content)) {
        //         valid = false
        //         error = 'Invalid base64 content'
        // }
        //
        console.log('Input inside validatePEM is: ', input)
        if (!input || typeof input !== 'string') {
                valid = false
                error = 'Invalid input'
        } else {
                valid = true
        }

        return {valid, type, error}
}
