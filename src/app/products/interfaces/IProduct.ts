///<summary>
///Interfaz IProduct
///</summary>
export interface IProduct {
    id:          number; /// Id del producto
    name:        string; /// Nombre del producto
    price:       number; /// Precio del producto
    stock:       number; /// Stock del producto
    imageUrl:    string; /// Url de la imagen del producto
    productType: ProductType; /// Tipo de producto
}

export interface ProductType {
    id:   number; /// Id del tipo de producto
    name: string; /// Nombre del tipo de producto
}