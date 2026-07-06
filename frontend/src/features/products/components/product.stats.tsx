import type { IconType } from 'react-icons';
import { LuPackageMinus, LuPackageOpen } from 'react-icons/lu';
import { TbPackages } from 'react-icons/tb';
import { useProductsStats, useProductStats } from '../product.hook';
import type { TProductStats } from '../product.schema';

export const ProductsStats = () => {
	const { data, isLoading } = useProductsStats();

	if (isLoading || !data) {
		// skeleton
		return <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1"></section>;
	}
	const { stockLevel } = data;

	return <StockLevelList stockLevel={stockLevel} />;
};

const StockLevelList = ({ stockLevel }: TProductStats) => {
	return (
		<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
			<StockLevelItem
				Icon={TbPackages}
				color="blue"
				count={stockLevel?.totalProducts ?? 0}
				name="Total Products"
			/>
			<StockLevelItem Icon={LuPackageMinus} color="yellow" count={stockLevel?.lowStock} name="Low in Stock" />
			<StockLevelItem Icon={LuPackageOpen} color="red" count={stockLevel?.outOfStock} name="Out of Stock" />
		</section>
	);
};
type TColor = 'yellow' | 'red' | 'blue';
const colorMap: Record<TColor, Record<'bg' | 'text' | 'iconBg', string>> = {
	yellow: {
		bg: 'bg-yellow-100',
		text: 'text-yellow-600',
		iconBg: 'bg-yellow-200',
	},
	red: {
		bg: 'bg-red-100',
		text: 'text-red-600',
		iconBg: 'bg-red-200',
	},
	blue: {
		bg: 'bg-blue-100',
		text: 'text-blue-600',
		iconBg: 'bg-blue-200',
	},
};

interface IProductLevel {
	name: string;
	count: number;
	Icon: IconType;
	color: TColor;
}
const StockLevelItem = ({ color, count, name, Icon }: IProductLevel) => {
	const styles = colorMap[color];
	return (
		<section className={`${styles.bg} ${styles.text} h-[160px] p-4 rounded-lg shadow-xs flex items-center gap-4`}>
			<span className={`p-3 ${styles.iconBg} rounded-lg`}>
				<Icon size={28} />
			</span>
			<div>
				<span className="text-3xl font-semibold">{count}</span>
				<h2 className="text-sm ">{name}</h2>
			</div>
		</section>
	);
};
