import type { IComment } from './IComment';
import type { ILike } from './ILike';

export interface IPost {
	title: string;
	created: number;
	content: string | null;
	userUid: string | null;
	userName: string | null;
	comments: Record<string, IComment>;
	likes: Record<string, ILike>;
}

export function Post(
	title: string = '',
	created: number = Date.now(),
	content: string | null,
	comments: Record<string, IComment> = {},
	likes: Record<string, ILike> = {},
	userUid: string | null,
	userName: string | null
): IPost {
	return {
		title,
		content,
		created,
		userUid,
		userName,
		comments,
		likes
	};
}
