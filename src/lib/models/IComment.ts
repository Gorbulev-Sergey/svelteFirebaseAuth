import { User, type IUser } from './IUser';

export interface IComment {
	text: string;
	created: number;
	user: IUser;
}

export function Comment(text = '', created = Date.now(), user = User()): IComment {
	return {
		text,
		created,
		user
	};
}
