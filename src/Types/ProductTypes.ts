export type Product = {
    id: number,
    name: string,
    productCategory: ProductCategory,
    productPrices: ProductPrices,
    productSizes: ProductSizes
}

export type AddProductDTO = {
    name: string,
    productCategoryId: number,
    height: number,
    weight: number,
    diameter: number,
    priceWithoutVAT: number,
    productionCost: number
}

export type ProductsData = {
    content: Product[],
    last: boolean,
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number    
}

export type ProductCategory = {
    id: number,
    categoryName: string
}

export type ProductPrices = {
    id: number,
    finalPrice: number,
    priceWithoutVAT: number,
    productionCost: number,
}

export type ProductSizes = {
    id: number,
    diameter: number,
    height: number,
    weight: number,
    width: number | null
}