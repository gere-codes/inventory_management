import { useEffect, useMemo, useState } from 'react';
import { selectSuppliersList, selectSuppliersPagination, supplierThunk } from '@suppliers';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SupplierTable } from '@suppliers';
import { EModalMode, EModalType, openModal, SearchBar } from '@common';
import { debounce } from '@utils';
import { Button } from '@/shared/components/ui';
import type { TSupplier } from '@/features/suppliers/supplier.schema';

export const SuppliersPage = () => {
	const FIRST_PAGE = 1;
	const [term, setTerm] = useState<string>('');

	const suppliers = useAppSelector(selectSuppliersList);
	const { currentPage, itemsPerPage, totalItems, totalPages } = useAppSelector(selectSuppliersPagination);

	const pagiination = useAppSelector(selectSuppliersPagination);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(supplierThunk.paginate({ page: pagiination.currentPage, limit: pagiination.itemsPerPage }));
	}, [pagiination?.currentPage, pagiination?.itemsPerPage, dispatch]);

	const handleDelete = async (supplier: TSupplier) => {
		dispatch(openModal({ data: supplier, type: EModalType.SUPPLIER, mode: EModalMode.DELETE }));
	};
	const handleEnd = async (supplier: TSupplier) => {
		dispatch(openModal({ data: supplier, type: EModalType.SUPPLIER, mode: EModalMode.EDIT }));
	};

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(supplierThunk.search({ term, page: FIRST_PAGE, limit: itemsPerPage }));
			}, 500),
		[dispatch, itemsPerPage],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);
	return (
		<section>
			{/* Search + Add */}
			<section className="flex justify-between items-end">
				<div className="flex flex-col gap-2 flex-1">
					<h2 className="text-xl font-bold">Suppliers List</h2>
					<SearchBar
						value={term}
						onSearch={(newValue) => {
							setTerm(newValue);
							debouncedSearch(newValue);
						}}
						placeholder="Search..."
					/>
				</div>

				<Button
					className="w-fit flex items-center gap-1 text-white"
					style={{ width: 140, height: 40 }}
					onClick={() =>
						dispatch(openModal({ data: null, mode: EModalMode.CREATE, type: EModalType.SUPPLIER }))
					}
				>
					+ Add Supplier
				</Button>
			</section>

			{/* Table */}
			<SupplierTable suppliers={suppliers} onDelete={handleDelete} onEdit={handleEnd} />
		</section>
	);
};
