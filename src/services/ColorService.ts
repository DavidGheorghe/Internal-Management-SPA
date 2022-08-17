import { Color, ColorDTO } from "@/types/ColorTypes";
import { APIUrls, computeURLWithId, computePaginationPartFromFetchURL } from "@/utils/APIURLs";
import { axiosInstance, createEntityDataFromResponse } from "@/utils/Utils";
import { AxiosResponse } from "axios";

export async function fetchColors(numberOfPigments: number, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string) {
    const url = computeFetchURL(numberOfPigments, pageNo, pageSize, sortBy, sortDir, searchText);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedColorsData = createEntityDataFromResponse<Color>(response);
    return fetchedColorsData;
}

export async function fetchAllColors() {
    const url = APIUrls.API_COLORS_ROOT + "/all";
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedColors = response.data;
    return fetchedColors;
}
// export async function fetchColorsWithOnePigment(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string) {
//     const url = computeFethURLForColorsWithOnePigment(pageNo, pageSize, sortBy, sortDir);
//     const response = await axiosInstance({
//         method: 'get',
//         url: url
//     });
//     const fetchedColorsData = createEntityDataFromResponse<Color>(response);
//     return fetchedColorsData;
// }
// export async function fetchColorsWithTwoPigments(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string) {
//     const url = computeFethURLForColorsWithTwoPigments(pageNo, pageSize, sortBy, sortDir);
//     const response = await axiosInstance({
//         method: 'get',
//         url: url
//     });
//     const fetchedColorsData = createEntityDataFromResponse<Color>(response);
//     return fetchedColorsData;
// }
export async function fetchColorById(id: number) {
    const url = computeURLWithId(APIUrls.API_COLORS_ROOT, id);
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const fetchedColor = createColorFromResponse(response);
    return fetchedColor;
}

export async function addColor(newColor: ColorDTO) {
    const url = APIUrls.API_COLORS_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: newColor
    });
    const addedColor = createColorFromResponse(response);
    return addedColor;
}

export async function deleteColorById(id: number) {
    const url = computeURLWithId(APIUrls.API_COLORS_ROOT, id);
    const response = await axiosInstance({
        method: 'delete',
        url: url
    });
    const deletedColor = createColorFromResponse(response);
    return deletedColor;
}

export async function updateColor(id: number, colorWithUpdates: ColorDTO) {
    const url = computeURLWithId(APIUrls.API_COLORS_ROOT, id);
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: colorWithUpdates
    });
    const updatedColor = createColorFromResponse(response);
    return updatedColor;
}

function computeFetchURL(numberOfPigments: number, pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, searchText?: string) {
    let url: string = APIUrls.API_COLORS_ROOT;
    if (numberOfPigments === 1) {
        url += "/one-pigment";
    } else if (numberOfPigments === 2) {
        url += "/two-pigments";
    } else if (numberOfPigments === 3) {
        url += "/three-pigments";
    }
    url += "?"; 
    if (searchText) {
        url += 'keyword=' + searchText.trim() + "&";
    } 
    if (pageNo !== undefined) {
        url += 'pageNo=' + pageNo;
    }
    if (pageSize) {
        url += '&pageSize=' + pageSize;
    }
    if (sortBy) {
        url += '&sortBy=' + sortBy;
    }
    if (sortDir) {
        url += '&sortDir=' + sortDir;
    }
    return url;
}

function computeFethURLForColorsFilteredByPigment(pageNo?: number, pageSize?: number, sortBy?: string, sortDir?: string, numberOfPigments?: number) {
    let url: string = APIUrls.API_COLORS_ROOT;
    if (numberOfPigments) {
        url += '?numberOfPigments=' + numberOfPigments; 
    }
    url += '&' + computePaginationPartFromFetchURL(pageNo, pageSize, sortBy, sortDir, false);
    return url;
}

function createColorFromResponse(response: AxiosResponse<any>) {
    let color = {} as Color;
    color.id = response.data.id;
    color.name = response.data.name;
    color.firstPigment = response.data.firstPigment;
    color.firstPigmentPercentage = response.data.firstPigmentPercentage;
    color.secondPigment = response.data.secondPigment;
    color.secondPigmentPercentage = response.data.secondPigmentPercentage;
    color.thirdPigment = response.data.thirdPigment;
    color.thirdPigmentPercentage = response.data.thirdPigmentPercentage;
    return color;
}
