import { Color } from "./ColorTypes"
import { Customer } from "./CustomerTypes"
import { Product } from "./ProductTypes"
import { SearchSelectOption } from "./UtilsTypes"

export type Order = {
    id: number,
    status: OrderStatus,
    details: string,
    dueDate: Date,
    entryDate: Date,
    customer: Customer,
    isPinned: Boolean
}
export type DashboardOrder = {
    id: number,
    status: OrderStatus,
    details: string,
    dueDate: Date,
    entryDate: Date,
    customer: Customer,
    isPinned: Boolean,
    isFocused: Boolean
}

export enum OrderStatus {
    NEW = 1,
	POURING = 2,
	DRYING = 3,
	SANDING = 4,
	SEALING = 5,
	PACKING = 6,
	READY = 7,
    COMPLETE = 8
}

export type RetrievedOrderContentDTO = {
    id: number,
    color: Color,
    product: Product,
    quantity: number,
    price: number
}

export type OrderDTO = {
    statusId: number,
    dueDate: string,
    details: string,
    customerId: number,
    content: AddOrderContentDTO[]
}

export type AddOrderContentDTO = {
    productId: number,
    colorId: number,
    quantity: number
}

export type OrderContentSearchSelectType = {
    product: SearchSelectOption,
    color: SearchSelectOption,
    quantity: number
}

export type ActiveAndDueOrdersReportsDTO = {
    numberOfDueOrders: number,
    numberOfActiveOrders: number,
}

export type OrdersCompletedReportDTO = {
    numberOfCompletedOrdersEightWeeksAgo: number,
    numberOfCompletedOrdersSevenWeeksAgo: number,
    numberOfCompletedOrdersSixWeeksAgo: number,
    numberOfCompletedOrdersFiveWeeksAgo: number,
    numberOfCompletedOrdersFourWeeksAgo: number,
    numberOfCompletedOrdersThreeWeeksAgo: number,
    numberOfCompletedOrdersTwoWeeksAgo: number,
    numberOfCompletedOrdersOneWeekAgo: number,
}

export type NewOrdersReportDTO = {
    numberOfNewOrdersEightWeeksAgo: number
    numberOfNewOrdersSevenWeeksAgo: number
    numberOfNewOrdersSixWeeksAgo: number
    numberOfNewOrdersFiveWeeksAgo: number
    numberOfNewOrdersFourWeeksAgo: number
    numberOfNewOrdersThreeWeeksAgo: number
    numberOfNewOrdersTwoWeeksAgo: number
    numberOfNewOrdersOneWeekAgo: number
}