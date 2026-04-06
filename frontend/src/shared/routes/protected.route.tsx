import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@hooks/index';
import { selectAuth } from '@auth/store/auth.selectors';

export const ProtectedRoute = () => {
	const { isAuthenticated, user, status } = useAppSelector(selectAuth);

	if (status === 'loading') {
		return <div className="h-screen w-screen flex justify-center items-center">Loading...</div>;
	}

	// if no user/not authenticated, redirect to login page
	if (!user || !isAuthenticated || status === 'failed') {
		return <Navigate to="/login" replace />;
	}

	// if authenticated, render the child routes
	return (
		<>
			<Outlet />
		</>
	);
};
