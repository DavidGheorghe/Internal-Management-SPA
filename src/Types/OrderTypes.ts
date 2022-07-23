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
    customer: Customer
}

export enum OrderStatus {
    NEW = 1,
	POURING = 2,
	DRYING = 3,
	SANDING = 4,
	SEALING = 5,
	PACKING = 6,
	READY = 7
}

export type RetrievedOrderContentDTO = {
    id: number,
    color: Color,
    product: Product,
    quantity: number
}

export type OrderDTO = {
    statusId: number,
    dueDate: string, // not sure yet, maybe Date
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