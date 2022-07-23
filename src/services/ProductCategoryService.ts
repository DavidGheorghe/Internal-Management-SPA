import { ProductCategory } from "@/types/ProductCategoryTypes";
import { axiosInstance } from "@/utils/Utils"
import { APIUrls } from "@/utils/APIURLs";
import { ref } from "vue";

export async function getProductCategoriesNames() {
    const names = ref<string[]>([]);
    const response = axiosInstance({
        method: "get",
        url: APIUrls.API_PRODUCT_CATEGORIES + "/names"
    });
    names.value = (await response).data;
    return names;
}

export async function getProductCategoriesWithoutPagination() {
    const response = await axiosInstance({
        method: "get",
        url: APIUrls.API_PRODUCT_CATEGORIES + "/all"
    });
    let fetchedData = [] as ProductCategory[];
    fetchedData = response.data;
    return fetchedData;
}
