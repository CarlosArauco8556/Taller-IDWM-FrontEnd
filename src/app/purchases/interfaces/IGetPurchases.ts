import { ISaleItemDto } from "./ISaleItemDto";
/**
 * Interface para obtener las compras
 */
export interface IGetPurchases {
    purchaseId:          number;         // ID de la compra
    userName:            string;         // Nombre de usuario
    email:               string;         // Correo electrónico
    transaction_Date:    Date;           // Fecha de la transacción
    country:             string;         // País
    city:                string;         // Ciudad
    commune:             string;         // Comuna
    street:              string;         // Calle
    purchase_TotalPrice: number;         // Precio total de la compra
    saleItemDtos:        ISaleItemDto[]; // Lista de productos
}