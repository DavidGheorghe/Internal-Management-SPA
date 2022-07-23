import { Order, RetrievedOrderContentDTO } from "@/types/OrderTypes";
import { EntityData } from "@/types/UtilsTypes";
import { AxiosResponse } from "axios";
import { APIUrls } from "./APIURLs";

export function createOrdersDataFromResponse(response: AxiosResponse<any>) {
    const orderData = {} as EntityData<Order>;
    orderData.pageNo = response.data.pageNo;
    orderData.pageSize = response.data.pageSize;
    orderData.totalElements = response.data.totalElements;
    orderData.totalPages = response.data.totalPages;
    orderData.last = response.data.last;
    orderData.content = createOrdersFromResponseData(response);
    
    return orderData;
}

export function createOrdersFromResponseData(response: AxiosResponse<any>): Order[] {
    const orders = [] as Order[];
    for (let i = 0; i < response.data.content.length; i++) {
        const order = {} as Order;
        order.id = response.data.content[i].id;
        order.customer = response.data.content[i].customer;
        order.status = response.data.content[i].status;
        order.details = response.data.content[i].details;
    
        const dueDateInMills = Date.parse(response.data.content[i].dueDate);
        order.dueDate = new Date(dueDateInMills);
        const entryDateInMills = Date.parse(response.data.content[i].entryDate);
        order.entryDate = new Date(entryDateInMills);

        orders.push(order);
    }

    return orders;
}

export function createOrderFromResponse(response: AxiosResponse<any>): Order {
    const order = {} as Order;
    order.id = response.data.id;
    order.customer = response.data.customer;
    order.details = response.data.details;
    order.dueDate = response.data.dueDate;
    order.entryDate = response.data.entryDate;
    order.status = response.data.status;

    return order;
}

export function createOrderContentFromResponse(response: AxiosResponse<any>): RetrievedOrderContentDTO[] {
    const content = [] as RetrievedOrderContentDTO[];
    for (let i = 0; i < response.data.length; i++) {
        const item = {} as RetrievedOrderContentDTO;
        item.id = response.data[i].id;
        item.product = response.data[i].product;
        item.color = response.data[i].color;
        item.quantity = response.data[i].quantity;

        content.push(item);
    }
    
    return content;
}

export function computeFetchContentURL(id: number): string {
    return APIUrls.API_ORDERS_ROOT + "/content/" + id;
}