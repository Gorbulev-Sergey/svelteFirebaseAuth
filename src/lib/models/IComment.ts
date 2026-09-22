export interface IComment {
	text: string;
	created: number;
	userUid?: string;
	userName?: string;
}

export function Comment(
	text: string = '',
	created: number = Date.now(),
	userUid?: string,
	userName?: string
) {
	return {
		text,
		created,
		userUid,
		userName
	};
}
