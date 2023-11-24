import { get, writable } from "svelte/store"
import { UserAuthDataStore } from "./auth"
import { push } from "svelte-spa-router"

interface createRoleAccessorParams {
        roleAccess : number[]
}

export function createRoleAccessor({ roleAccess } : createRoleAccessorParams) {
        let role_id = writable(0)
        let name = writable('')

        UserAuthDataStore.subscribe((authData) => {
                role_id.set(authData.role_id)
                name.set(authData.username)
        })
        role_id.subscribe((id) => {
                console.log("RoleID", id)
                if(id == 0 && !get(name)) {
                        push('/')
                }
                if(!roleAccess.includes(id)){
                        push('/dashboard/')
                }
        })

        name.subscribe((name) => {
                if(get(role_id) == 0 && !name) {
                        push('/')
                }
        })
}