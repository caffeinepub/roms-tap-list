import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Beer {
    id: bigint;
    abv: number;
    ibu: bigint;
    onTap: boolean;
    name: string;
    description: string;
    style: string;
}
export interface backendInterface {
    addBeer(name: string, style: string, abv: number, ibu: bigint, description: string): Promise<bigint>;
    getAllBeers(): Promise<Array<Beer>>;
    getBeer(id: bigint): Promise<Beer>;
    getBeersByStatus(onTap: boolean): Promise<Array<Beer>>;
    getBeersByStyle(style: string): Promise<Array<Beer>>;
    removeBeer(id: bigint): Promise<void>;
    toggleOnTap(id: bigint): Promise<void>;
    updateBeer(id: bigint, name: string, style: string, abv: number, ibu: bigint, description: string): Promise<void>;
}
