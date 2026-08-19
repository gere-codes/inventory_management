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
		<div className="flex flex-col gap-6 justify-center items-center bg-white rounded w-[350px] px-4 py-2 ">
			<div className="flex flex-col">
				<div className="flex flex-col gap-1 justify-center items-center ">
					<p className="text-amber-300 border rounded-full border-amber-500 p-2">
						<IoWarning size={25} />
					</p>
					<h2 className="capitalize font-semibold text-lg">{title}</h2>
				</div>

				<div className="flex gap-4 flex-col justify-between flex-1">
					<div>
						<p className="text-center ">{message}</p>
						<p className="text-center ">{name}? </p>
					</div>
				</div>
			</div>

			<div className="flex gap-2  w-full ">
				<Button
					className=""
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
	);
};
