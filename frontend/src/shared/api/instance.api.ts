import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE || 'http://localhost:5000/api';

// public instance
export const publicInstance = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// private instance
export const privateInstance = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// refresh token instance
export const refreshClient = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});
