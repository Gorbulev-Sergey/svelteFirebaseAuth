import { adminAuth } from '$lib/db/firebase-admin';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session') || '';
	event.locals.user = null;

	if (sessionCookie) {
		try {
			const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
			const name = (decoded as any).name;
			const picture = (decoded as any).picture;
			const role = (decoded as any).role || 'user';

			//console.log(decoded);

			event.locals.user = {
				uid: decoded.uid,
				email: decoded.email || '',
				name,
				picture,
				role
			};
		} catch {
			// Кука невалидна — пользователь не авторизован
			event.cookies.delete('session', { path: '/' });
		}
	}

	return resolve(event);
};
