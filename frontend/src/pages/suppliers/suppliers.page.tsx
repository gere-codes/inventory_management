import { useEffect, useMemo, useState } from 'react';
import { selectSuppliersList, selectSuppliersPagination, supplierThunk } from '@suppliers';
import { useAppDispatch, useAppSelector } from '@hooks';
import { SupplierTable } from '@suppliers';
import { EModalMode, EModalType, openModal, Pagination, SearchBar } from '@common';
import { debounce } from '@utils';
import { Button } from '@ui';
import { suppplierQuerySchema, type TSupplier } from '@/features/suppliers/supplier.schema';
import { setSupplierCurrentPage, setSuppliersPerPage } from '@/features/suppliers/supplier.slice';
import { useSearchParams } from 'react-router';

export const SuppliersPage = () => {
	const FIRST_PAGE = 1;
	const [term, setTerm] = useState<string>('');
	const [searchParams, setSearchParams] = useSearchParams();

	const suppliers = useAppSelector(selectSuppliersList);
	const { totalPages } = useAppSelector(selectSuppliersPagination);

	const dispatch = useAppDispatch();

	const page = Number(searchParams.get('page')) || 1;
	const limit = Number(searchParams.get('limit')) || 10;
	const search = searchParams.get('search') || term;

	useEffect(() => {
		const fetchTableData = async () => {
			setTerm(search);

			const payload = {
				search,
				page,
				limit,
			};

			const result = suppplierQuerySchema.safeParse(payload);

			if (!result.success) {
				console.error(result.error);
				return;
			}
			await dispatch(supplierThunk.getCollection(result.data));
		};

		fetchTableData();
	}, [dispatch, page, limit]);

	const handleDelete = async (supplier: TSupplier) => {
		dispatch(openModal({ data: supplier, type: EModalType.SUPPLIER, mode: EModalMode.DELETE }));
	};
	const handleEnd = async (supplier: TSupplier) => {
		dispatch(openModal({ data: supplier, type: EModalType.SUPPLIER, mode: EModalMode.EDIT }));
	};

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				const payload = {
					search: term,
					page: FIRST_PAGE,
					limit,
				};

				const result = suppplierQuerySchema.safeParse(payload);

				if (!result.success) {
					console.error(result.error);
					return;
				}
				dispatch(supplierThunk.getCollection(result.data));

				searchParams.set('page', String(FIRST_PAGE));
				searchParams.set('search', term);

				setSearchParams(searchParams);
			}, 500),
		[dispatch, limit, searchParams, setSearchParams],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handlePageChange = (pageNum: number) => {
		dispatch(setSupplierCurrentPage(pageNum));

		searchParams.set('page', String(pageNum));
		setSearchParams(searchParams);
	};

	const handlePerPageChange = (perPage: number) => {
		dispatch(setSuppliersPerPage(perPage));

		searchParams.set('limit', String(perPage));
		setSearchParams(searchParams);
	};

	return (
		<section className="pt-4 flex flex-col h-full  justify-between">
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

			{/* Pagination */}
			<Pagination
				currentPage={page}
				totalPages={totalPages}
				itemsPerPage={limit}
				onPageChange={handlePageChange}
				onPerPageChange={handlePerPageChange}
			/>
		</section>
	);
};
