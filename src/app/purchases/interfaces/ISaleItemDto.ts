/**
 * Interface que define la estructura de los elementos de la lista de compras
 */
export interface ISaleItemDto {
    productName: string;   // Nombre del producto
    productType: string;   // Tipo de producto
    quantity:    number;   // Cantidad
    unitPrice:   number;   // Precio unitario
    totalPrice:  number;   // Precio total
}