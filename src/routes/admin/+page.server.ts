import { adminAuth } from '$lib/db/firebase-admin';
import { redirect, type Actions } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) redirect(301, '/');
}

export const actions: Actions = {
	setRole: async ({ request }) => {
		const formData = await request.formData();
		const uid = formData.get('uid') as string;
		const role = formData.get('role') as string | null;

		console.log('Мои данные: ', uid, role);
		if (!uid) throw new Error('Missing uid');

		try {
			if (role === null) {
				await adminAuth.setCustomUserClaims(uid, {});
			} else {
				await adminAuth.setCustomUserClaims(uid, { role });
			}
			return { success: true };
		} catch (e) {
			console.error(e);
			throw new Error('Failed to set role');
		}
	}
};
