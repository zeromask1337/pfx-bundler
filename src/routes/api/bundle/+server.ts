import {fail, type RequestHandler } from '@sveltejs/kit';
import { pemSchema } from '../../../lib/validators/pem';
import { FileService } from '$lib/services/FileService';

export const GET: RequestHandler = async ({ url, request }) => {
        const data = await request.formData()
        const certificate = data.get('certificate')
        const key = data.get('key')

        if (!key) return fail(400, {key, missing: true}) 
        if (!certificate) return fail(400, {certificate, missing: true}) 

        const keyResult = pemSchema('PRIVATE_KEY').safeParse(key)
        if (!keyResult.success) return fail(400, {key, invalid: true})

        const certificateResult = pemSchema('CERTIFICATE').safeParse(certificate)
        if (!certificateResult.success) return fail(400, {key, invalid: true})

        const {
                key: keyFilePath,
                certificate: certificateFilePath,
                directory
        } = await FileService.createTempFiles({key, certificate})
        const filename = url.searchParams.get("filename") || "client-cert"
        const outputPath = `/tmp/${filename}.pfx`

        const command = new Deno.Command("openssl", {
                args: [
                        "pkcs12",
                        "-export",

                        // Output file path
                        "-out", outputPath,

                        // Key file path
                        "-inkey", keyFilePath,

                        // Certificate file path
                        "-in", certificateFilePath,

                        // Password for output file
                        "-passout", "pass:"
                ]
        })

        const {code, stdout, stderr} = await command.output()

        console.info({
                code,
                stdout: new TextDecoder().decode(stdout),
                stderr: new TextDecoder().decode(stderr),
        })

        // Read file and return as response
        const fileData = await Deno.readFile(outputPath);
        
        // Cleanup temp files
        await FileService.cleanup(directory);

        return new Response(fileData, {
            headers: {
                'Content-Type': 'application/x-pkcs12',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': fileData.length.toString()
            }
        });
};
