import { InputField } from '@ui/index';
import { memo } from 'react';
interface Props {
	value: string;
	onSearch: (term: string) => void;
	name?: string;
	placeholder: string;
}
export const SearchBar: React.FC<Props> = memo(({ value, onSearch, name, placeholder }: Props) => {
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
});

SearchBar.displayName = 'Search Bar';
