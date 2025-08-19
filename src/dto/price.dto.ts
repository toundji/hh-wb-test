export class WbPriceDto {
    boxDeliveryAndStorageExpr!: string;
    boxDeliveryBase!: string;
    boxDeliveryCoefExpr!: string;
    boxDeliveryLiter!: string;
    boxDeliveryMarketplaceBase!: string;
    boxDeliveryMarketplaceCoefExpr!: string;
    boxDeliveryMarketplaceLiter!: string;
    boxStorageBase!: string;
    boxStorageCoefExpr!: string;
    boxStorageLiter!: string;
    geoName!: string;
    warehouseName!: string;
}

export class WbPrice {
    id!: number;
    code!: string;
    date!: Date;
    boxDeliveryAndStorageExpr!: number;
    boxDeliveryBase!: number;
    boxDeliveryCoefExpr!: number;
    boxDeliveryLiter!: number;
    boxDeliveryMarketplaceBase!: number;
    boxDeliveryMarketplaceCoefExpr!: number;
    boxDeliveryMarketplaceLiter!: number;
    boxStorageBase!: number;
    boxStorageCoefExpr!: number;
    boxStorageLiter!: number;
    geoName!: string;
    warehouseName!: string;
}

    

export interface WbPriceDb {
    id: number;
    code: string;
    date: Date;
    box_delivery_and_storage_expr?: number;
    box_delivery_base?: number;
    box_delivery_coef_expr?: number;
    box_delivery_liter?: number;
    box_delivery_marketplace_base?: number;
    box_delivery_marketplace_coef_expr?: number;
    box_delivery_marketplace_liter?: number;
    box_storage_base?: number;
    box_storage_coef_expr?: number;
    box_storage_liter?: number;
    geo_name: string;
    warehouse_name: string;
    created_at: Date;
    update_at: Date;
}

export interface WbPriceDbDto extends  Omit<WbPriceDb, 'id'| 'created_at' |'update_at' >{}





export class WpErrorBadReqDto {
    title!: string;

    detail!: string;

    requestId!: string;

    origin!: string;
}

export class WpErrorDto {
    title!: string;

    detail!: string;

    code!: string;

    requestId!: string;

    origin!: string;

    status!: string;

    statusText!: string;

    timestam!: string;
}
