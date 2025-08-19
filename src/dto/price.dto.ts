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
