export interface CartItem {
    id:          number;
    name:        string;
    price:       number;
    imageUrl:    string;
    productType: ProductType;
    quantity:    number;
    totalPrice:  number;
}

export interface ProductType {
    id:   number;
    name: string;
}