import { FileService } from '$lib/services/FileService';
import { PEMService } from '$lib/services/PEMService';
import {json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
        const key = PEMService.validateOnServer("key", url) 
        const certificate = PEMService.validateOnServer("certificate", url) 

        const [keyFilePath, certificateFilePath] = await FileService.createTempFiles([key, certificate])

        const command = new Deno.Command("openssl", {
                args: [
                        "pkcs12",
                        "-export",

                        // Output file path
                        "-out", url.searchParams.get("filename") ?? "/tmp/client-cert.pfx",

                        // Key file path
                        "-inkey", keyFilePath,

                        // Certificate file path
                        "-in", certificateFilePath,

                        // Password for output file
                        "-passout", "pass:"
                ]
        })

        const {code, stdout, stderr} = await command.output()

	return json({
                code,
                stdout: new TextDecoder().decode(stdout),
                stderr: new TextDecoder().decode(stderr)
        })
};
