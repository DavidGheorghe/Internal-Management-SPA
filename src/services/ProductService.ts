import { ProductCategoriesIds } from '@/Types/ProductCategoryTypes';
import { AddProductDTO, Product, ProductsData } from '@/Types/ProductTypes';
import { APIUrls, axiosInstance } from "../utils/Utils";

export async function fetchProducts(url: string): Promise<ProductsData> {
    const response = await axiosInstance({
        method: 'get',
        url: url
    })
    let fetchedData = {} as ProductsData;
    fetchedData.content = response.data.content;
    fetchedData.last = response.data.last;
    fetchedData.pageNo = response.data.pageNo;
    fetchedData.pageSize = response.data.pageSize;
    fetchedData.totalPages = response.data.totalPages;
    fetchedData.totalElements = response.data.totalElements;
    return fetchedData;
}

export async function fetchProductById(url: string): Promise<Product> {
    const response = await axiosInstance({
        method: 'get',
        url: url
    })
    let fetchedData = {} as Product;
    fetchedData.id = response.data.id;
    fetchedData.name = response.data.name;
    fetchedData.productCategory = response.data.productCategory;
    fetchedData.productPrices = response.data.productPrices;
    fetchedData.productSizes = response.data.productSizes;
    return fetchedData;
}

export async function addProduct(newProduct: AddProductDTO): Promise<Product> {
    const url = APIUrls.API_PRODUCT_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: newProduct
    });
    let createdProduct = {} as Product;
    createdProduct.id = response.data.id;
    createdProduct.name = response.data.name;
    createdProduct.productCategory = response.data.productCategory;
    createdProduct.productPrices = response.data.productPrices;
    createdProduct.productSizes = response.data.productSizes;
    return createdProduct;
}

export async function fetchProductsByCategoriesIds(url: string, ids: ProductCategoriesIds): Promise<ProductsData> {
    console.log(ids);
    const response = await axiosInstance({
        method: 'get',
        url: url,
        params: {
            "ids": ids.ids
        }
    });
    let fetchedData = {} as ProductsData;
    fetchedData.content = response.data.content;
    fetchedData.last = response.data.last;
    fetchedData.pageNo = response.data.pageNo;
    fetchedData.pageSize = response.data.pageSize;
    fetchedData.totalPages = response.data.totalPages;
    fetchedData.totalElements = response.data.totalElements;
    return fetchedData;
}

// TODO: create function for fetched data (duplicated code).

