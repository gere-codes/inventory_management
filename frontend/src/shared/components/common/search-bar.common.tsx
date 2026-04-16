import { InputField } from '@ui/index';
import { memo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
interface Props {
	value: string;
	onSearch: (term: string) => void;
	name?: string;
	placeholder?: string;
}
export const SearchBar: React.FC<Props> = memo(({ value, onSearch, name, placeholder }: Props) => {
	const [focus, setFocus] = useState(false);
	return (
		<section
			className={`w-[250px] border flex items-center rounded-lg py-2 px-2 ${focus ? 'border-primary' : 'border-gray-300'}`}
		>
			<CiSearch size={20} />
			<input
				type="text"
				className="w-full outline-0 text-base px-1"
				value={value}
				onChange={(e) => onSearch(e.target.value)}
				name={name}
				placeholder={placeholder || 'Search...'}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</section>
	);
});

SearchBar.displayName = 'Search Bar';
