import { type RootState } from '@store';

export const selectModal = (state: RootState) => state.modal;
export const selectModalData = (state: RootState) => state.modal.data;
export const selectModalIsOpen = (state: RootState) => state.modal.isOpen;
export const selectModalMode = (state: RootState) => state.modal.mode;
export const selectModalType = (state: RootState) => state.modal.type;
