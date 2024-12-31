import { ISaleItemDto } from "./ISaleItemDto";

export interface IGetPurchases {
    purchaseId:          number;
    userName:            string;
    email:               string;
    transaction_Date:    Date;
    country:             string;
    city:                string;
    commune:             string;
    street:              string;
    purchase_TotalPrice: number;
    saleItemDtos:        ISaleItemDto[];
}