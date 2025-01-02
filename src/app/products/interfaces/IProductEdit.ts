export interface IProductEdit {
    name:        string;
    price:       number;
    stock:       number;
    image:       File | null;
    productTypeId: number;
}