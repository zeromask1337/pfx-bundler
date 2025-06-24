import validatePEM, { type PEMType } from '$lib/validatePEM';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

function validatePEMServer(value: PEMType, url: URL) {
	const data = url.searchParams.get(value) ?? error(400, `Couldn't read ${value}`)
        const {invalid, error: valueError} = validatePEM(data, value)
        if (invalid) {
                console.log("Errored on: ", data)
                error(400, `Invalid ${value} syntax: ${valueError}`)
        }

        return data
}

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
        const key = validatePEMServer("key", url) 
        const certificate = validatePEMServer("certificate", url) 

        const [keyFilePath, certificateFilePath] = await createTempFiles([key, certificate])

        const command = new Deno.Command("openssl", {
                args: [
                        "pkcs12",
                        "-export",
                        "-out",
                        "/tmp/test_bunlder_name.pfx",
                        "-inkey",
                        keyFilePath,
                        "-in",
                        certificateFilePath,
                        "-passout",
                        "pass:"
                ]
        })

        const {code, stdout, stderr} = await command.output()

	return json({code, stdout: new TextDecoder().decode(stdout), stderr: new TextDecoder().decode(stderr)})
};
