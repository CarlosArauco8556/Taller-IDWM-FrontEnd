/// <summary>
/// Interfaz IProductEdit
/// </summary>
export interface IProductEdit {
    name:        string; /// Nombre del producto
    price:       number; /// Precio del producto
    stock:       number; /// Stock del producto
    image:       File | null; /// Imagen del producto
    productTypeId: number; /// Id del tipo de producto
}