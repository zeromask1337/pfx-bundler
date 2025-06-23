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

export const GET: RequestHandler = ({ url }) => {
        const key = validatePEMServer("key", url) 
        const certificate = validatePEMServer("certificate", url) 

	return json({certificate, key});
};
