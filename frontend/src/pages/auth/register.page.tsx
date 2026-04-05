import { useForm } from 'react-hook-form';
import { Button, InputField } from '@ui/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { type TRegisterFormData, registerchema } from '@/features/auth/auth.schema';

export const RegisterPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TRegisterFormData>({
		resolver: zodResolver(registerchema),
		mode: 'all',
	});

	console.log(errors);
	const onSubmit = (data: TRegisterFormData) => {
		console.log('Form data:', data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-md mx-auto p-6 flex items-center justify-center h-screen"
		>
			<div className="flex flex-col gap-4 w-full">
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
				<Button variant="primary" type="submit">
					Register
				</Button>
			</div>
		</form>
	);
};
