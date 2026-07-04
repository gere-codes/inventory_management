import React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const genColors = (n: number) => Array.from({ length: n }, (_, i) => `hsl(${(360 * i) / n}, 55%, 70%)`);

interface Props {
	data: {
		name: string;
		count: number;
	}[];
}
export function DynamicPieChart({ data }: Props) {
	const colors = genColors(data?.length);
	const chartData = data.map((item, index) => ({
		name: item.name,
		value: Number(item.count),
		fill: colors[index],
	}));

	const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
		const RADIAN = Math.PI / 180;
		const radius = outerRadius + 25;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="#333"
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline="central"
				fontSize={12}
			>
				{`${name} (${(percent * 100).toFixed(0)}%)`}
			</text>
		);
	};

	return (
		<section className="h-[350px] w-[450px]  ">
			<ResponsiveContainer width={'100%'} height={'70%'}>
				<PieChart width={'100%'} height={'100%'}>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius={0}
						outerRadius={80}
						paddingAngle={0}
						cornerRadius={0}
						label={renderLabel}
					/>
				</PieChart>
			</ResponsiveContainer>
		</section>
	);
}
