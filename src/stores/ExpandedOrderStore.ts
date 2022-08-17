import { DashboardOrder, OrderStatus } from "@/types/OrderTypes";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { ExpandedOrder } from "./ExpandedOrderStateI";

export const useExpandedOrderStore = defineStore('expandedOrder', {
    state: (): ExpandedOrder => reactive({
        displayed: false,
        displayedOrder: undefined
    }),
    getters: {
        isDisplayed: (state) => state.displayed,
        getDisplayedOrder: (state) => state.displayedOrder,
        getDisplayedOrderId: (state) => {
            if (state.displayedOrder) {
                return state.displayedOrder.id;
            }
            return null;
        }
    },
    actions: {
        hideOrder() {
            this.displayed = false;
            this.displayedOrder = undefined;
        },
        displayOrder(newOrder: DashboardOrder) {
            this.displayedOrder = newOrder;
            this.displayed = true;
        },
        updateDisplayedOrder(newOrder: DashboardOrder) {
            this.displayedOrder = newOrder;
        },
        removeDisplayedOrder() {
            this.displayedOrder = undefined;
        },
        updateStatus(newStatus: OrderStatus) {
            if (this.displayedOrder) {
                this.displayedOrder.status = newStatus; 
            }
        }
    }
});