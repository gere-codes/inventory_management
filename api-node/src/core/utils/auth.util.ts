import { EScope } from '../types/auth.type.js';

export const getScope = (role: string): EScope => {
	if (role === 'admin') {
		return EScope.Any;
	} else if (role === 'user') {
		return EScope.Own;
	} else {
		return EScope.Public;
	}
};
