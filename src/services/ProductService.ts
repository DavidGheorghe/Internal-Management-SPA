import { ProductCategoriesIds } from '@/Types/ProductCategoryTypes';
import { ProductDTO, Product, ProductsData } from '@/Types/ProductTypes';
import { AxiosResponse } from 'axios';
import { APIUrls, axiosInstance } from "../utils/Utils";

// TODO change approach to compute the url here, not recieve it as a parameter. 
export async function fetchProducts(url: string): Promise<ProductsData> {
    const response = await axiosInstance({
        method: 'get',
        url: url
    })
    const fetchedData = createProductDataFromResponse(response);
    return fetchedData;
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
    const url = APIUrls.API_PRODUCT_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: newProduct
    });
    const createdProduct = createProductFromResponse(response);
    return createdProduct;
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

export async function updateProduct(id: number, updatedProduct: ProductDTO) {
    const url = APIUrls.API_PRODUCT_ROOT + "/" + id;
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: updatedProduct
    });
    const newlyUpdatedProduct = createProductFromResponse(response);
    return newlyUpdatedProduct;
}

export async function fetchProductsFilteredBy(searchedText: string) {
    const url = APIUrls.API_PRODUCT_ROOT + "/search?keyword=" + searchedText;
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedProducts = createProductDataFromResponse(response);
    return fetchedProducts; 
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