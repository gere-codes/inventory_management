import React, { type TextareaHTMLAttributes } from 'react';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	className?: React.HtmlHTMLAttributes<HTMLTextAreaElement>['className'];
}

export const TextareaField: React.FC<TextareaFieldProps> = ({ label, error, className, ...props }) => {
	return (
		<div className="flex flex-col w-full">
			{label && (
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
					{label}
				</label>
			)}

			<textarea
				className={`appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className} ${
					error ? 'border-red-500' : 'border-gray-300'
				}`}
				{...props}
			/>

			{error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
		</div>
	);
};
