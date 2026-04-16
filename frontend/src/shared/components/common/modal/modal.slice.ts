import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { EModalMode, EModalType } from './modal.enum';

interface ModalState {
	isOpen: boolean;
	mode: EModalMode;
	type: EModalType;
	data: any;
}

const initialState: ModalState = {
	isOpen: false,
	mode: EModalMode.VIEW,
	type: EModalType.RESET,
	data: null,
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<{ type: EModalType; mode: EModalMode; data: any }>) => {
			state.isOpen = true;
			state.mode = action.payload.mode;
			state.type = action.payload.type;
			state.data = action.payload.data;
		},
		closeModal: (state) => {
			state.isOpen = false;
			state.data = null;
			state.mode = EModalMode.VIEW;
		},
	},
});

export const { openModal, closeModal } = modalSlice.actions;
