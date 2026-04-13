import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Button, InputField } from '@ui/index';
import { type TLoginFormData, loginSchema } from '@auth/auth.schema';
import { useAppDispatch, useAppSelector } from '@hooks/index';
import { authThunk } from '@/features/auth/auth.thunks';
import { selectAuth } from '@/features/auth/auth.selectors';
import { clearError } from '@/features/auth/auth.slice';

export const LoginPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<TLoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'all',
	});

	const dispatch = useAppDispatch();

	const { error: serverError, status } = useAppSelector(selectAuth);

	const onSubmit = (data: TLoginFormData) => {
		dispatch(authThunk.login(data));
	};

	const values = watch();

	useEffect(() => {
		if (serverError) {
			dispatch(clearError());
		}
	}, [values.email, values.password]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-md mx-auto p-6 flex items-center justify-center h-screen"
		>
			<div className="flex flex-col gap-6 w-full">
				<h2 className="font-bold text-4xl text-center">Login</h2>
				<InputField
					{...register('email')}
					label="Email"
					id="email"
					type="email"
					placeholder="your@mail.com"
					error={errors.email?.message as string}
				/>

				<InputField
					{...register('password')}
					label="Password"
					id="password"
					type="password"
					placeholder="........"
					error={errors.password?.message as string}
				/>
				<div>
					<div className="relative">
						<Button variant="primary" type="submit">
							Login
						</Button>
						{serverError && (
							<small className="text-red-600 absolute -bottom-4 left-0 text-center w-full">
								{serverError.message}
							</small>
						)}
					</div>
					<small className="text-sm m-2 text-center  flex justify-center mt-4">
						Don't have an account?
						<Link className="underline underline-offset-4 ml-1" to="/register">
							Register
						</Link>
					</small>
				</div>
			</div>
		</form>
	);
};
