import { client_email, private_key, project_id } from '$env/static/private';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

function initAdmin() {
	if (getApps().length > 0) return getApp();
	private_key;

	return initializeApp({
		credential: cert({
			projectId: project_id,
			clientEmail: client_email,
			privateKey: private_key
		}),
		databaseURL: 'https://fir-auth-e9c00-default-rtdb.europe-west1.firebasedatabase.app'
	});
}

const app = initAdmin();

export const adminAuth = getAuth(app);
export const adminDb = getDatabase(app);

export async function setUserRole(uid: string, role: 'admin' | 'editor' | null) {
	if (role === null) {
		// Убираем claim: передаём объект без поля role
		await adminAuth.setCustomUserClaims(uid, {});
		return;
	}
	await adminAuth.setCustomUserClaims(uid, { role });
}
