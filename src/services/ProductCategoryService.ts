import { ProductCategory } from "@/Types/ProductCategoryTypes";
import { APIUrls, axiosInstance } from "@/utils/Utils"
import { ref } from "vue";

export async function getProductCategoriesNames() {
    const names = ref<string[]>([]);
    const response = axiosInstance({
        method: "get",
        url: APIUrls.API_PRODUCT_CATEGORY + "/names"
    });
    names.value = (await response).data;
    return names;
}

export async function getProductCategoriesWithoutPagination() {
    const response = await axiosInstance({
        method: "get",
        url: APIUrls.API_PRODUCT_CATEGORY + "/all"
    });
    let fetchedData = [] as ProductCategory[];
    fetchedData = response.data;
    return fetchedData;
}
