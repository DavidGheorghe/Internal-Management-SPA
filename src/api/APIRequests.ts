export abstract class APIRequests<T> {
    abstract getById(id: number): T;
    abstract getAll() : T[];
    abstract deleteById(id: number): T;
}