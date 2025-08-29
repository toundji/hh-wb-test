import { textToNum } from "#utils/util.js";
import { z } from "zod";

export const wbPriceSchema = z.object({
  boxDeliveryBase: z.string().transform(textToNum),
  boxDeliveryCoefExpr: z.string().transform(textToNum),
  boxDeliveryLiter: z.string().transform(textToNum),
  boxDeliveryMarketplaceBase: z.string().transform(textToNum),
  boxDeliveryMarketplaceCoefExpr: z.string().transform(textToNum),
  boxDeliveryMarketplaceLiter: z.string().transform(textToNum),
  boxStorageBase: z.string().transform(textToNum),
  boxStorageCoefExpr: z.string().transform(textToNum),
  boxStorageLiter: z.string().transform(textToNum),
  geoName: z.string(),
  warehouseName: z.string(),
});

export type WbPriceDto = z.infer<typeof wbPriceSchema>;


export const wbApiResponseSchema = z.object({
  dtNextBox: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-mm-dd
  dtTillMax: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-mm-dd
  warehouseList: z.array(wbPriceSchema),
});

export type WbApiResponseDto = z.infer<typeof wbApiResponseSchema>;


export class WbPrice {
    id!: number;
    date!: Date;
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
    date: string;
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
    updated_at: Date;
}

export interface WbPriceDbDto extends  Omit<WbPriceDb, 'id'| 'created_at' |'updated_at' >{}


export interface SpreadsheetDto{
    spreadsheet_id?: string;
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
