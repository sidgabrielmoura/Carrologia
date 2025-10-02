import { proxy } from "valtio";

export const useLayout = proxy({
    isSearching: false
})