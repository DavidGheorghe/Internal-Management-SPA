import { defineStore } from "pinia";

export const useTodosSidebarStore = defineStore('todosSidebar', {
    state: () => ({
        displayed: true
    }),
    getters: {
        isDisplayed: (state) => state.displayed
    },
    actions: {
        hideSidebar() {
            this.displayed = false;
        },
        displaySidebar() {
            this.displayed = true;
        }
    }
});