import { writable } from "svelte/store";
import { resetUser } from "./auth";
import { push } from "svelte-spa-router";

export function createLogout() {
    const open = writable(false)

    const initiateLogout = () => {
        open.set(true)
    }

    const onContinue = () => {
        open.set(false)
        resetUser()
        push('/')
    }

    const onCancel = () => {
        open.set(false)
    }


    return {
        open, initiateLogout, onCancel, onContinue
    }
}