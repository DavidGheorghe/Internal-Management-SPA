import { OrderDTO, Order } from "@/types/OrderTypes";
import { EntityData } from "@/types/UtilsTypes";
import { APIUrls, computeFetchURL, computeURLWithId } from "@/utils/APIURLs";
import { axiosInstance } from "@/utils/Utils";
import { computeFetchContentURL, createOrderContentFromResponse, createOrderFromResponse, createOrdersDataFromResponse } from "@/utils/OrderServiceUtils";
import axios from "axios";

export async function fetchOrders(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string): Promise<EntityData<Order>> {
    const url = computeFetchURL(APIUrls.API_ORDERS_ROOT, pageNo, pageSize, sortBy, sortDir, searchText);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrders = createOrdersDataFromResponse(response);
    return fetchedOrders;
}

export async function fetchOrderById(id: number) {
    const url = computeURLWithId(APIUrls.API_ORDERS_ROOT, id);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrder = createOrderFromResponse(response);
    return fetchedOrder;
}

export async function deleteOrderById(id: number) {
    const url = computeURLWithId(APIUrls.API_ORDERS_ROOT, id);
    const response = await axiosInstance({
        method: 'delete',
        url: url
    });
    const deletedOrder = createOrderFromResponse(response);
    return deletedOrder;
}

export async function fetchContentByOrderId(id: number) {
    const url = computeFetchContentURL(id);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedContent = createOrderContentFromResponse(response);
    return fetchedContent;
}

export async function addOrder(orderDTO: OrderDTO) {
    const url = APIUrls.API_ORDERS_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: orderDTO
    });
    const addedOrder = createOrderFromResponse(response);
    return addedOrder;
}

export async function updateOrder(id: number, orderDTO: OrderDTO) {
    const url = computeURLWithId(APIUrls.API_ORDERS_ROOT, id);
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: orderDTO
    });
    const updatedOrder = createOrderFromResponse(response);
    return updatedOrder;
}

// TODO: implement update order content (client and server)

export async function updateOrderStatus(orderId: number, statusId: number) {
    const url = APIUrls.API_ORDERS_ROOT + "/status/" + orderId + "/" + statusId;
    const response = await axiosInstance({
        method: 'put',
        url: url
    });
    const updatedOrder = createOrderFromResponse(response);
    return updatedOrder;
}