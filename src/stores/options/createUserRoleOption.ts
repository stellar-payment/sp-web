import { writable } from "svelte/store"
import { UserAuthDataStore } from "../auth"
import { USER_ROLE } from "@/constant/option"

export function createUserRoleOption() {
    let roleOption = writable([])

    UserAuthDataStore.subscribe((userData) => {
        let tempOption = USER_ROLE.filter((option) => {
            return option.value > userData.role_id
        })
        roleOption.set(tempOption)
    })
    return {
        roleOption
    }
}