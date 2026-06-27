import type { FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface SelectOption {
	value: string | number;
	label: string;
}

interface GenericSelectProps<TFormValues extends FieldValues> {
	label: string;
	name: Path<TFormValues>;
	register: UseFormRegister<TFormValues>;
	options: SelectOption[];
	isLoading?: boolean;
	disabled?: boolean;
	required?: boolean;
}

export const Select = <TFormValues extends FieldValues>({
	label,
	name,
	register,
	options,
	isLoading,
	disabled,
	required = false,
}: GenericSelectProps<TFormValues>) => {
	if (isLoading) return <div className="animate-pulse w-full h-[42px] bg-gray-200 rounded" />;

	return (
		<div className="w-full">
			<label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">
				{label}
				{required && '*'}
			</label>
			<select
				id={name}
				required={required}
				{...register(name)}
				disabled={disabled}
				className="w-full px-3 py-2 border border-gray-300 rounded-md h-[42px] bg-white"
			>
				<option value="">Select {label.toLowerCase()}</option>
				{options?.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
};
