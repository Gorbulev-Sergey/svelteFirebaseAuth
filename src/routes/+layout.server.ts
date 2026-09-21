export async function load({ locals }) {
	//console.log(await locals.user);
	return {
		user: await locals.user
	};
}
