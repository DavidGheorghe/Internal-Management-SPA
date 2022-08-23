import { NewOrdersReportDTO, Order, OrdersCompletedReportDTO, ActiveAndDueOrdersReportsDTO, OrderStatus, RetrievedOrderContentDTO } from "@/types/OrderTypes";
import { EntityData } from "@/types/UtilsTypes";
import { def } from "@vue/shared";
import { Axios, AxiosResponse } from "axios";
import { APIUrls, computePaginationPartFromFetchURL } from "./APIURLs";

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
        const currentOrder = response.data.content[i];
        order.id = currentOrder.id;
        order.customer = currentOrder.customer;
        order.status = currentOrder.status;
        order.details = currentOrder.details;
    
        const dueDateInMills = Date.parse(currentOrder.dueDate);
        order.dueDate = new Date(dueDateInMills);
        const entryDateInMills = Date.parse(currentOrder.entryDate);
        order.entryDate = new Date(entryDateInMills);
        order.isPinned = currentOrder.pinned;
        order.assignee = currentOrder.assignee;

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
    order.isPinned = response.data.pinned;
    order.assignee = response.data.assignee;

    return order;
}

export function createOrdersFromResponse(response: AxiosResponse<any>): Order[] {
    const orders: Order[] = [];
    for (let i = 0; i < response.data.length; i++) {
        const responseOrder = response.data[i];
        const order = {} as Order;

        order.id = responseOrder.id;
        order.customer = responseOrder.customer;
        order.details = responseOrder.details;
        order.dueDate = responseOrder.dueDate;
        order.isPinned = responseOrder.pinned;
        order.status = responseOrder.status;
        order.entryDate = responseOrder.entryDate;
        order.assignee = responseOrder.assignee;

        orders.push(order);
    }
    return orders;
}

export function createOrderContentFromResponse(response: AxiosResponse<any>): RetrievedOrderContentDTO[] {
    const content = [] as RetrievedOrderContentDTO[];
    for (let i = 0; i < response.data.length; i++) {
        const item = {} as RetrievedOrderContentDTO;
        item.id = response.data[i].id;
        item.product = response.data[i].product;
        item.color = response.data[i].color;
        item.quantity = response.data[i].quantity;
        item.price = response.data[i].contentPrice;
        
        content.push(item);
    }
    
    return content;
}

export function computeFetchContentURL(id: number): string {
    return APIUrls.API_ORDERS_ROOT + "/content/" + id;
}

export function computeStatusFromString(statusAsStr: string): number | undefined {
    let status: OrderStatus | undefined;
    switch (statusAsStr) {
        case "NEW":
            status = OrderStatus.NEW;
            break;
        case "POURING":
            status = OrderStatus.POURING;
            break;
        case "DRYING":
            status = OrderStatus.DRYING;
            break;
        case "SANDING":
            status = OrderStatus.SANDING;
            break;
        case "SEALING":
            status = OrderStatus.SEALING;
            break;
        case "PACKING":
            status = OrderStatus.PACKING;
            break;
        case "READY":
            status = OrderStatus.READY;
            break;
        case "COMPLETE":
            status = OrderStatus.COMPLETE
            break;
        default:
            status = undefined;
    }
    return status;
}

export function getIdFromStatus(status: OrderStatus): number {
    const idAsStr = OrderStatus[status];
    const id = Number.parseInt(idAsStr);
    return id;
}

export function computeFetchURLFilteredByStatus(statusId: number, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string) {
    let url = APIUrls.API_ORDERS_ROOT +"/status?keyword=" + searchText + "&statusId=" + statusId + "&" + computePaginationPartFromFetchURL(pageNo, pageSize, sortBy, sortDir, false);
    return url;
}

export function formatDateAsString(date: Date) {
    const dateInLocaleDateStr = date.toLocaleDateString();
    const dates = dateInLocaleDateStr.split("/");
    const finalDate = dates[2] + "-" + formatMonth(dates[0]) + "-" + formatDay(dates[1]);
    return finalDate;
}

export function formatMonth(monthStr: string) {
    if (monthStr.length === 1) {
        return "0" + monthStr;
    }
    return monthStr;
}

export function formatDay(dayStr: string) {
    if (dayStr.length === 1) {
        return "0" + dayStr;
    }
    return dayStr;
}

export function createOrdersReportsDTOFromResponse(response: AxiosResponse<any>) {
    const reports: ActiveAndDueOrdersReportsDTO = {
        numberOfDueOrders: response.data.numberOfDueOrders,
        numberOfActiveOrders: response.data.numberOfActiveOrders
    };
    return reports;
}

export function createOrdersCompletedReportFromResponse(response: AxiosResponse<any>) {
    const report: OrdersCompletedReportDTO = {
        numberOfCompletedOrdersEightWeeksAgo: response.data.numberOfOrderCompletedEightWeeksAgo,
        numberOfCompletedOrdersSevenWeeksAgo: response.data.numberOfOrderCompletedSevenWeeksAgo,
        numberOfCompletedOrdersSixWeeksAgo: response.data.numberOfOrderCompletedSixWeeksAgo,
        numberOfCompletedOrdersFiveWeeksAgo: response.data.numberOfOrderCompletedFiveWeeksAgo,
        numberOfCompletedOrdersFourWeeksAgo: response.data.numberOfOrderCompletedFourWeeksAgo,
        numberOfCompletedOrdersThreeWeeksAgo: response.data.numberOfOrderCompletedThreeWeeksAgo,
        numberOfCompletedOrdersTwoWeeksAgo: response.data.numberOfOrderCompletedTwoWeeksAgo,
        numberOfCompletedOrdersOneWeekAgo: response.data.numberOfOrderCompletedOneWeekAgo,
    }
    return report;
}

export function createNewOrdersReportFromResponse(response: AxiosResponse<any>) {
    const report: NewOrdersReportDTO = {
        numberOfNewOrdersEightWeeksAgo: response.data.numberOfNewOrdersEightWeeksAgo,
        numberOfNewOrdersSevenWeeksAgo: response.data.numberOfNewOrdersSevenWeeksAgo,
        numberOfNewOrdersSixWeeksAgo: response.data.numberOfNewOrdersSixWeeksAgo,
        numberOfNewOrdersFiveWeeksAgo: response.data.numberOfNewOrdersFiveWeeksAgo,
        numberOfNewOrdersFourWeeksAgo: response.data.numberOfNewOrdersFourWeeksAgo,
        numberOfNewOrdersThreeWeeksAgo: response.data.numberOfNewOrdersThreeWeeksAgo,
        numberOfNewOrdersTwoWeeksAgo: response.data.numberOfNewOrdersTwoWeeksAgo,
        numberOfNewOrdersOneWeekAgo: response.data.numberOfNewOrdersOneWeekAgo
    }
    return report;
}