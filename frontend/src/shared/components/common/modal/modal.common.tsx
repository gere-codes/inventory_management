import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectModal } from './moda.selector';
import { closeModal } from './modal.slice';

interface Props {
	children: React.ReactNode;
	onClose?: () => void;
}
export const Modal = ({ children, onClose }: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const { isOpen } = useAppSelector(selectModal);

	const dispatch = useAppDispatch();

	const handleClickOutside = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation();
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				dispatch(closeModal());
				if (onClose) {
					onClose();
				}
			}
		},
		[dispatch, onClose],
	);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [handleClickOutside]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 ">
			<div onClick={(e) => e.stopPropagation()} ref={modalRef} className="bg-white p-2 rounded-lg shadow-md">
				{children}
			</div>
		</div>
	);
};
