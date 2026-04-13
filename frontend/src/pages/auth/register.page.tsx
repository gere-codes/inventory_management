import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '@hooks';
import { Button, InputField } from '@ui';
import { authThunk, selectAuth, clearError, registerchema, type TRegisterFormData } from '@auth';

export const RegisterPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<TRegisterFormData>({
		resolver: zodResolver(registerchema),
		mode: 'all',
	});

	const { error: serverError, status } = useAppSelector(selectAuth);

	const dispatch = useAppDispatch();

	const onSubmit = (data: TRegisterFormData) => {
		dispatch(authThunk.register(data));
	};

	const values = watch();

	useEffect(() => {
		if (serverError) {
			dispatch(clearError());
		}
	}, [values.email, values.password, values.confirmPassword, values.name]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-md mx-auto p-6 flex items-center justify-center h-screen"
		>
			<div className="flex flex-col gap-6 w-full">
				<h2 className="font-bold text-4xl text-center">Register</h2>
				<InputField
					{...register('name')}
					label="Name"
					id="name"
					type="text"
					placeholder="Enter your name"
					error={errors.name?.message as string}
				/>
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
				<InputField
					{...register('confirmPassword')}
					label="Confirm Password"
					id="confirmPassword"
					type="password"
					placeholder="........"
					error={errors.confirmPassword?.message as string}
				/>
				<div>
					<Button variant="primary" type="submit">
						Register
					</Button>
					<small className="text-sm m-2 text-center  flex justify-center">
						Already have an account?
						<Link className="underline underline-offset-4 ml-1" to="/login">
							Login
						</Link>
					</small>
				</div>
			</div>
		</form>
	);
};
