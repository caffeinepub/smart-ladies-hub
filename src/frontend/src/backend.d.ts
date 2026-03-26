import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    title: string;
    icon: string;
    description: string;
    isActive: boolean;
    imageUrl?: string;
    category: Category;
    badge?: string;
}
export interface Offer {
    id: bigint;
    title: string;
    discountText: string;
    description: string;
    isActive: boolean;
}
export interface StoreDTO {
    whatsapp: string;
    offers: Array<Offer>;
    announcement: string;
    activeProducts: Array<Product>;
}
export interface StoreConfig {
    whatsapp: string;
    announcement: string;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    jewellery = "jewellery",
    offer = "offer",
    accessories = "accessories",
    ladies = "ladies",
    daily = "daily"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOffer(offer: Offer): Promise<bigint>;
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteOffer(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getActiveProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getOffers(): Promise<Array<Offer>>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getStore(): Promise<StoreDTO>;
    getStoreConfig(): Promise<StoreConfig>;
    getStorePublicContent(): Promise<StoreDTO>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOffer(offer: Offer): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateStoreConfig(config: StoreConfig): Promise<void>;
}
