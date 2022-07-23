import { Customer, CustomerDTO } from "@/types/CustomerTypes";
import { APIUrls, computeFetchURL, computeURLWithId } from "@/utils/APIURLs";
import { axiosInstance, createEntityDataFromResponse } from "@/utils/Utils";
import { AxiosResponse } from "axios";

export async function fetchCustomers(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string) {
    const url = computeFetchURL(APIUrls.API_CUSTOMERS_ROOT, pageNo, pageSize, sortBy, sortDir, searchText);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedCustomersData = createEntityDataFromResponse<Customer>(response); 
    return fetchedCustomersData;
}

export async function fetchAllCustomers(): Promise<Customer[]> {
    const url = APIUrls.API_CUSTOMERS_ROOT + "/all";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedCustomers = response.data;
    return fetchedCustomers;
}

export async function fetchCustomerById(id: number) {
    const url = computeURLWithId(APIUrls.API_CUSTOMERS_ROOT, id);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedCustomer = createCustomerFromResponse(response);
    return fetchedCustomer;
}

export async function deleteCustomerById(id: number) {
    const url = computeURLWithId(APIUrls.API_CUSTOMERS_ROOT, id);
    const response = await axiosInstance({
        method: 'delete',
        url: url
    });
    const deletedCustomer = createCustomerFromResponse(response);
    return deletedCustomer;
}

export async function updateCustomer(id: number, customer: Customer) {
    const url = computeURLWithId(APIUrls.API_CUSTOMERS_ROOT, id);
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: customer
    });
    const updatedCustomer = createCustomerFromResponse(response);
    return updatedCustomer;
}

export async function addCustomer(customer: CustomerDTO) {
    const url = APIUrls.API_CUSTOMERS_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: customer
    });
    const addedCustomer = createCustomerFromResponse(response);
    return addedCustomer;
}

function createCustomerFromResponse(response: AxiosResponse<any>) {
    const customer = {} as Customer;
    customer.id = response.data.id;
    customer.companyName = response.data.companyName;
    customer.firstName = response.data.firstName;
    customer.lastName = response.data.lastName;
    customer.cui = response.data.cui;
    customer.email = response.data.email;
    customer.phoneNumber = response.data.phoneNumber;
    customer.billingAddress = response.data.billingAddress;
    customer.deliveryAddress = response.data.deliveryAddress;
    return customer;
}