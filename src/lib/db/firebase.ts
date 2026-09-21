import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAuvnE6n9q0Mm4XfIg0ajLGiw4Uh-42hO8',
	authDomain: 'fir-auth-e9c00.firebaseapp.com',
	databaseURL: 'https://fir-auth-e9c00-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'fir-auth-e9c00',
	storageBucket: 'fir-auth-e9c00.firebasestorage.app',
	messagingSenderId: '331462448305',
	appId: '1:331462448305:web:9702de15a40f0a0baf7e90',
	measurementId: 'G-DQCDTGZBVN'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'ru';
export const db = getDatabase(app);
