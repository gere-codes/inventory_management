import { InputField } from '@ui/index';

export const SearchBar: React.FC<{
	value: string;
	onSearch: (term: string) => void;
	name?: string;
	placeholder: string;
}> = ({ value, onSearch, name, placeholder }) => {
	return (
		<>
			<InputField
				type="text"
				placeholder={placeholder}
				className="pl-3 border border-gray-200 rounded-lg outline-none  bg-gray-100/50 w-[300px]"
				value={value}
				onChange={(e) => onSearch(e.target.value)}
				name={name}
			/>
		</>
	);
};
