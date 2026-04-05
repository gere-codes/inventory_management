import { useForm } from 'react-hook-form';
import { Button, InputField } from '@/shared/components/ui/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TLoginFormData, loginSchema } from '@/features/auth/auth.schema';
import { Link } from 'react-router';

export const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TLoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'all',
	});

	console.log(errors);
	const onSubmit = (data: TLoginFormData) => {
		console.log('Form data:', data);
	};

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
					<Button variant="primary" type="submit">
						Login
					</Button>
					<small className="text-sm m-2 text-center  flex justify-center">
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
