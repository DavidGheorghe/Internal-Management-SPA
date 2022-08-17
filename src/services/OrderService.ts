import { OrderDTO, Order } from "@/types/OrderTypes";
import { EntityData } from "@/types/UtilsTypes";
import { APIUrls, computeFetchURL, computeURLWithId } from "@/utils/APIURLs";
import { axiosInstance } from "@/utils/Utils";
import { computeFetchContentURL, computeFetchURLFilteredByStatus, createOrderContentFromResponse, createOrderFromResponse, createOrdersDataFromResponse, createOrdersFromResponse, formatDateAsString } from "@/utils/OrderServiceUtils";

export async function fetchOrders(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string): Promise<EntityData<Order>> {
    const url = computeFetchURL(APIUrls.API_ORDERS_ROOT, pageNo, pageSize, sortBy, sortDir, searchText);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrders = createOrdersDataFromResponse(response);
    return fetchedOrders;
}
export async function fetchOrdersByStatus(statusId: number, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string): Promise<EntityData<Order>> {
    const url = computeFetchURLFilteredByStatus(statusId, pageNo, pageSize, sortBy, sortDir, searchText);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrders = createOrdersDataFromResponse(response);
    return fetchedOrders;
}

export async function fetchOrderById(id: number): Promise<Order> {
    const url = computeURLWithId(APIUrls.API_ORDERS_ROOT, id);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrder = createOrderFromResponse(response);
    return fetchedOrder;
}

export async function fetchPinnedOrders() {
    const url = APIUrls.API_ORDERS_ROOT + "/pinned";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedOrders = createOrdersFromResponse(response);
    return fetchedOrders;
}

export async function deleteOrderById(id: number): Promise<Order> {
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

export async function pinOrder(id: number) {
    const url = APIUrls.API_ORDERS_ROOT + "/pin/" + id;
    const response = await axiosInstance({
        method: 'put',
        url: url
    });
    const order = createOrderFromResponse(response);
    return order;
}

export async function unpinOrder(id: number) {
    const url = APIUrls.API_ORDERS_ROOT + "/unpin/" + id;
    const response = await axiosInstance({
        method: 'put',
        url: url
    });
    const order = createOrderFromResponse(response);
    return order;
}

export async function updateDueDate(orderId: number, newDueDate: Date) {
    const finalDueDate = formatDateAsString(newDueDate);
    // const finalDueDate = dueDateinISOFormat.substring(0, 10);
    const url = APIUrls.API_ORDERS_ROOT + "/due-date?id=" + orderId +"&due-date=" + finalDueDate;
    const response = await axiosInstance({
        method: 'put',
        url: url
    });
    const order = createOrderFromResponse(response);
    return order;
}

export async function computeContentPrice(productId: number, amount: number): Promise<number> {
    const url = APIUrls.API_ORDERS_ROOT + "/content-price?productId=" + productId + "&amount=" + amount;
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const price = response.data;
    return price;
}