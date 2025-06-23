import validatePEM from '$lib/validatePEM';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

function validatePEMServer(value: string, url: URL) {
	const data = url.searchParams.get(value) ?? error(400, `Couldn't read ${value}`)
        const {invalid, error: valueError} = validatePEM(data)
        if (invalid) {
                console.log("Errored on: ", data)
                error(400, `Invalid ${value} syntax: ${valueError}`)
        }

        return data
}

async function createTempFiles(values: string[]) { const result: string[] = []

        const tempDirPath = await Deno.makeTempDir({
                prefix: "bundler_",
                dir: '/tmp'
        })

        for (const value of values) {
                const tempFilePath = await Deno.makeTempFile({
                        prefix: "test_pem_bundler_",
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

        const data = await createTempFiles([key, certificate])

	return json(data)
};
