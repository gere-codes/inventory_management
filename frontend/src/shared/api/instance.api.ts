import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE;

// public instance
export const publicInstance = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
});

// private instance
export const privateInstance = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
});

// refresh token instance
export const refreshClient = axios.create({
	baseURL: `${BASE_URL}`,
	withCredentials: true,
});
