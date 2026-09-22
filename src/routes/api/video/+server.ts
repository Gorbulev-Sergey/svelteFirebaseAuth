import { json } from '@sveltejs/kit';

export async function GET() {
	let r = await fetch('http://rutube.ru/api/video/person/1684462?limit=9');
	let v = await r.json();

	return json(v.results);
}
