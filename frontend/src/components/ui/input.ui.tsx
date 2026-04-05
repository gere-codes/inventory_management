import React, { type InputHTMLAttributes } from 'react';

interface InputFieldsProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	id?: string;
	className?: React.HtmlHTMLAttributes<HTMLInputElement>['className'];
}

export const InputField: React.FC<InputFieldsProps> = ({ label, error, id, className, ...props }) => {
	return (
		<div className="flex flex-col w-full relative">
			{label && (
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
					{label}
				</label>
			)}
			<input
				className={`appearance-none border rounded p-3 max-h-[42px] text-gray-700 outline-none ${className} ${
					error ? 'border-red-500' : 'border-gray-200'
				}`}
				id={id}
				{...props}
			/>
			{error && (
				<small className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full text-center right-1/2 text-red-600 text-xs">
					{error}
				</small>
			)}
		</div>
	);
};
