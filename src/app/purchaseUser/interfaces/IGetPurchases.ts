import { ISaleItemUserDto } from "./ISaleItemUserDto";

export interface IGetPurchases {
    purchaseId:          number;
    transaction_Date:    Date;
    country:             string;
    city:                string;
    commune:             string;
    street:              string;
    purchase_TotalPrice: number;
    saleItemDtos:        ISaleItemUserDto[];
}