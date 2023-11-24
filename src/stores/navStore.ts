import { get, writable, type Writable } from "svelte/store";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";

let NavbarKeyStore: Writable<string> = writable("");

NavbarKeyStore = persist(
  writable(""),
  createLocalStorage(true),
  "sp-navbar-store"
);

const updateNavKey = (navkey: string) => {
  if (get(NavbarKeyStore) == navkey) {
    NavbarKeyStore.set("");
  } else {
    NavbarKeyStore.set(navkey);
  }
};

const resetNavKey = () => {
  NavbarKeyStore.set("");
};

export { NavbarKeyStore, updateNavKey, resetNavKey };
