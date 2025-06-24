import { PEMService } from '$lib/services/PEMService';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

// TODO: Extract everything related to PEM to class
async function createTempFiles(values: string[]) { const result: string[] = []

        const tempDirPath = await Deno.makeTempDir({
                prefix: "bundler_",
                dir: '/tmp'
        })

        for (const value of values) {
                const tempFilePath = await Deno.makeTempFile({
                        prefix: `test_pem_bundler-`,
                        suffix: ".pem",
                        dir: tempDirPath
                })

                await Deno.writeTextFile(tempFilePath, value)

                result.push(tempFilePath)
        }

        return result
}

export const GET: RequestHandler = async ({ url }) => {
        const key = PEMService.validateOnServer("key", url) 
        const certificate = PEMService.validateOnServer("certificate", url) 

        const [keyFilePath, certificateFilePath] = await createTempFiles([key, certificate])

        const command = new Deno.Command("openssl", {
                args: [
                        "pkcs12",
                        "-export",

                        // Output file path
                        "-out",
                        "/tmp/test_bunlder_name.pfx",

                        // Key file path
                        "-inkey",
                        keyFilePath,

                        // Certificate file path
                        "-in",
                        certificateFilePath,

                        // Password for output file
                        "-passout",
                        "pass:"
                ]
        })

        const {code, stdout, stderr} = await command.output()

	return json({code, stdout: new TextDecoder().decode(stdout), stderr: new TextDecoder().decode(stderr)})
};
