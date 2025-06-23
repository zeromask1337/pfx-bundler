import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const certificate = url.searchParams.get('certificate') ?? error(400, "Couldn't read certificate")
	const key = url.searchParams.get('key') ?? error(400, "Couldn't read key")

	return json({certificate, key});
};
