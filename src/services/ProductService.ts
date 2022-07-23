import { ProductCategoriesIds } from '@/types/ProductCategoryTypes';
import { ProductDTO, Product, ProductsData } from '@/types/ProductTypes';
import { AxiosResponse } from 'axios';
import { axiosInstance } from "../utils/Utils";
import { APIUrls } from "@/utils/APIURLs";

// TODO change approach to compute the url here, not recieve it as a parameter. 
export async function fetchProducts(url: string): Promise<ProductsData> {
    const response = await axiosInstance({
        method: 'get',
        url: url
    })
    const fetchedData = createProductDataFromResponse(response);
    return fetchedData;
}

export async function fetchAllProducts() {
    const url = APIUrls.API_PRODUCTS_ROOT + "/all";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedProducts = response.data;
    return fetchedProducts;
}

export async function fetchProductById(url: string): Promise<Product> {
    const response = await axiosInstance({
        method: 'get',
        url: url
    })
    const fetchedProduct = createProductFromResponse(response);
    return fetchedProduct;
}

export async function addProduct(newProduct: ProductDTO): Promise<Product> {
    const url = APIUrls.API_PRODUCTS_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: newProduct
    });
    const addedProduct = createProductFromResponse(response);
    return addedProduct;
}

export async function fetchProductsByCategoriesIds(url: string, ids: ProductCategoriesIds): Promise<ProductsData> {
    const response = await axiosInstance({
        method: 'get',
        url: url,
        params: {
            "ids": ids.ids
        }
    });
    const fetchedData = createProductDataFromResponse(response);
    return fetchedData;
}

export async function updateProduct(id: number, productWithUpdates: ProductDTO) {
    const url = APIUrls.API_PRODUCTS_ROOT + "/" + id;
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: productWithUpdates
    });
    const newlyUpdatedProduct = createProductFromResponse(response);
    return newlyUpdatedProduct;
}

export async function fetchProductsFilteredBy(searchedText: string) {
    const url = APIUrls.API_PRODUCTS_ROOT + "/search?keyword=" + searchedText;
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedProducts = createProductDataFromResponse(response);
    return fetchedProducts; 
}

export async function deleteProductById(id: number) {
    const url = APIUrls.API_PRODUCTS_ROOT + "/" + id;
    const response = await axiosInstance({
        method: 'delete',
        url: url
    });
    const deletedProduct = createProductFromResponse(response);
    return deletedProduct;
}

function createProductFromResponse(response: AxiosResponse<any>) {
    const product = {} as Product;
    product.id = response.data.id;
    product.name = response.data.name;
    product.productCategory = response.data.productCategory;
    product.productPrices = response.data.productPrices;
    product.productSizes = response.data.productSizes;
    return product;
}

function createProductDataFromResponse(response: AxiosResponse<any>) {
    const productData = {} as ProductsData;
    productData.content = response.data.content;
    productData.last = response.data.last;
    productData.pageNo = response.data.pageNo;
    productData.pageSize = response.data.pageSize;
    productData.totalPages = response.data.totalPages;
    productData.totalElements = response.data.totalElements;
    return productData;
}