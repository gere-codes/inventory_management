import { IoWarning } from 'react-icons/io5';
import { Button } from '../../ui';

interface Props {
	title?: string;
	message?: string;
	name?: string;
	onCancel: () => void;
	onConfirm: () => void;
}
const defualtMessage = 'Are you sure you want to delete';
export const Confirmation = ({ title = 'warning', message = defualtMessage, name, onCancel, onConfirm }: Props) => {
	return (
		<div className="flex flex-col gap-5 w-[300px] min-h-[140px] ">
			<div className="flex gap-1 items-center ">
				<p className="text-amber-300 ">
					<IoWarning size={25} />
				</p>
				<h2 className="capitalize font-semibold">{title}</h2>
			</div>

			<div className="flex flex-col justify-between flex-1 gap-2">
				<p className="text-center ">{message}</p>
				<p className="text-center font-bold">
					{name}
					<span className="font-normal">?</span>
				</p>

				<div className="flex gap-2  justify-end">
					<Button
						style={{
							height: '35px',
							fontSize: 15,
						}}
						variant="secondary"
						onClick={onCancel}
					>
						No
					</Button>
					<Button
						style={{
							height: '35px',
							fontSize: 15,
							background: 'red',
						}}
						onClick={onConfirm}
					>
						Yes
					</Button>
				</div>
			</div>
		</div>
	);
};
