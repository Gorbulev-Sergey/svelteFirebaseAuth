export interface ILike {
	created: number;
	userUid?: string;
	userName?: string;
}

export function Like(created: number = Date.now(), userUid?: string, userName?: string) {
	return {
		created,
		userUid,
		userName
	};
}
