export type Color = {
    id: number,
    name: string,
    firstPigment: string,
    firstPigmentPercentage: number,
    secondPigment: string | null,
    secondPigmentPercentage: number | null,
    thirdPigment: string | null,
    thirdPigmentPercentage: number | null,
}

export type ColorDTO = {
    name: string,
    firstPigment: string,
    firstPigmentPercentage: number,
    secondPigment: string | null,
    secondPigmentPercentage: number | null,
    thirdPigment: string | null,
    thirdPigmentPercentage: number | null,
}


