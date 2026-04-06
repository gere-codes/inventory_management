import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@hooks/index';
import { selectAuth } from '@auth/store/auth.selectors';

export const PublicRoute = () => {
	const { isAuthenticated, user, status } = useAppSelector(selectAuth);

	if (status === 'loading' && !user)
		return <div className="h-screen w-screen flex justify-center items-center">Loading...</div>;

	if (isAuthenticated && user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};
