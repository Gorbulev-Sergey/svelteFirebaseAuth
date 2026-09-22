import { User, type IUser } from './IUser';

export interface ILike {
	created: number;
	user: IUser;
}

export function Like(created = Date.now(), user = User()): ILike {
	return {
		created,
		user
	};
}
