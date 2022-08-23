export function useRemoveElement<T>(index: number, array: T[]) {
    return array.filter((item, indexAux) => indexAux !== index);
}

