import { writable } from "svelte/store";

interface createModalParams {
    onContinue: () => void;
    onCancel: () => void;
}

export function createModal({ onContinue, onCancel }: createModalParams) {
    const isOpen = writable(false);

    const closeModal = () => {
        isOpen.set(false)
    }

    const openModal = () => {
        isOpen.set(true)
    }

    const onModalContinue = () => {
        onContinue()
        closeModal()
    }

    const onModalCancel = () => {
        onCancel()
        closeModal()
    }

    return {
        isOpen, openModal, onModalContinue, onModalCancel
    }
}