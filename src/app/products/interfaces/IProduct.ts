export interface IProduct {
    name:        string;
    price:       number;
    stock:       number;
    imageUrl:    string;
    productType: ProductType;
}

export interface ProductType {
    id:   number;
    name: string;
}