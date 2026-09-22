export interface IUser {
	uid?: string | null;
	name?: string | null;
}

export function User(uid = null, name = null): IUser {
	return {
		uid,
		name
	};
}
