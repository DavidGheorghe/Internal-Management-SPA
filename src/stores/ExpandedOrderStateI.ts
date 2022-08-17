import { DashboardOrder } from "@/types/OrderTypes";

export interface ExpandedOrder {
    displayed: boolean,
    displayedOrder: DashboardOrder | undefined
}