import { get, writable, type Writable } from 'svelte/store';

const defaultPageName = "Dashboard"

export let PageNameStore: Writable<string> = writable(defaultPageName)

PageNameStore = writable(defaultPageName);

export function getPageName() {
    return get(PageNameStore)
}

export function updateUser(pageName: string) {
    PageNameStore.update(($PageNameStore) => {
        $PageNameStore = pageName;
        return $PageNameStore;
    });
}

export function resetUser() {
    PageNameStore.set(defaultPageName);
}
