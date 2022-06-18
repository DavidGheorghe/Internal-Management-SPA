import { AddProductDTO, ProductsData } from "@/Types/ProductTypes";
import { addProduct, fetchProducts, fetchProductsByCategoriesIds } from "@/services/ProductService";
import { defineStore } from "pinia";
import { getProductCategoriesNames, getProductCategoriesWithoutPagination } from "@/services/ProductCategoryService";
import { ProductCategoriesIds } from "@/Types/ProductCategoryTypes";

export const useProductsStore = defineStore('products', {
    state: () => {
        return {
            productsData: {} as ProductsData
        }
    },
    getters: {
        getProducts: (state) => state.productsData
    },
    actions: {
        async fetchProducts(url: string) {
            const responseData = (await fetchProducts(url));
            this.productsData = responseData;
            // console.log(responseData)
            return responseData;
        },
        async fetchProductsCategoriesNames() {
            const responseData = (await getProductCategoriesNames());
            return responseData;
        },
        // async fetchProductsByCategory(categoryName: string) {
        //     const categories = (await getProductCategoriesWithoutPagination());
        //     // const category = categories.value.find(category => category.categoryName === categoryName);
        //     const responseData = (await getProductCategoriesWithoutPagination());
        //     return responseData;
        // },
        async getCategoryIdFromName(categoryName: string) {
            const categories = (await getProductCategoriesWithoutPagination());
            const category = categories.find(category => category.categoryName === categoryName);
            return category!.id;
        },
        async addProduct(newProduct: AddProductDTO) {
            const responseData = (await addProduct(newProduct));
            return responseData;
        },
        async fetchProductsByCategoriesIds(url: string, ids: ProductCategoriesIds) {
            const responseData = (await fetchProductsByCategoriesIds(url, ids));
            return responseData;
        }
    }
});