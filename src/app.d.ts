// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: { uid: string; email: string; name: string; picture: string; role: string } | null;
		}
	}
}

export {};
