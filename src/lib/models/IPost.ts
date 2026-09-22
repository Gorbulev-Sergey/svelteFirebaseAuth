import type { IComment } from './IComment';
import type { ILike } from './ILike';
import { User, type IUser } from './IUser';

export interface IPost {
	title: string;
	content?: string | null;
	created: number;
	user: IUser;
	comments: Record<string, IComment>;
	likes: Record<string, ILike>;
}

export function Post(
	title = '',
	content = null,
	created = Date.now(),
	user = User(),
	comments = {},
	likes = {}
): IPost {
	return {
		title,
		content,
		created,
		user,
		comments,
		likes
	};
}
