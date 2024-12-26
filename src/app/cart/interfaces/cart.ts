export interface Cart {
    cart_TotalPrice: number;
    cartItems:       CartItem[];
}

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