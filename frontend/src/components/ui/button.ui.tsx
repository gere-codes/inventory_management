import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
	const baseClasses = 'w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline';

	const variantClasses = {
		primary: 'bg-primary hover:bg-tertiary text-white',
		secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
	};

	return (
		<button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
			{children}
		</button>
	);
};
