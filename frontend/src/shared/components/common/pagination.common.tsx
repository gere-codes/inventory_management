import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
interface Props {
	currentPage: number;
	totalPages: number;
	itemsPerPage?: number;
	onPerPageChange?: (value: 10 | 25 | 50) => void;
	onPageChange?: (page: number) => void;
}
export const Pagination: React.FC<Props> = ({
	currentPage = 1,
	totalPages = 1,
	itemsPerPage = 10,
	onPerPageChange,
	onPageChange,
}: Props) => {
	const perPageOptions = [10, 25, 50];

	const safeTotalPages = totalPages < 1 ? 1 : totalPages;

	return (
		<div className="flex justify-end items-center gap-6 mt-4 pt-4 ">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-700">Rows per page:</span>
				<select
					value={itemsPerPage}
					onChange={(e) => onPerPageChange?.(parseInt(e.target.value) as any)}
					className="px-3 py-1.5 text-sm border border-gray-300/90 rounded-md focus:outline-none"
				>
					{perPageOptions.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center gap-3">
				<span className="text-sm font-medium text-gray-700">
					Page {currentPage} of {safeTotalPages}
				</span>
				<div className="flex gap-1">
					<button
						onClick={() => onPageChange?.(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Previous page"
					>
						<MdNavigateBefore size={20} />
					</button>
					<button
						onClick={() => onPageChange?.(currentPage + 1)}
						disabled={currentPage === safeTotalPages}
						className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Next page"
					>
						<MdNavigateNext size={20} />
					</button>
				</div>
			</div>
		</div>
	);
};
