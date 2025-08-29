import   wbpriceRepo from "#repository/wbprice.repo.js"
import { WbApiResponseDto, wbApiResponseSchema, WbPriceDbDto, WbPriceDto } from "#dto/price.dto.js";
import wbConf from "#config/env/wb.config.js";



export async function fetchWbPrices(today: string): Promise<WbApiResponseDto> {
  const response = await fetch(`${wbConf.WB_API_URL}?date=${today}`, {
    headers: { Authorization: `Bearer ${wbConf.WB_API_TOKEN}`, "Content-Type": "application/json" },
    method: "GET",
  });

  if (!response.ok){
    throw new Error(`WB API error: ${response.status}`);
  }

  const json = await response.json();
  const data = wbApiResponseSchema.parse(json.response.data);

  return data;

}


export async function savePrices(today: string, data: WbApiResponseDto) {
  const list: WbPriceDbDto[] = data.warehouseList.map(item => ({
    date: today,
    warehouse_name: item.warehouseName,
    geo_name: item.geoName,
    box_delivery_base: item.boxDeliveryBase,
    box_delivery_coef_expr: item.boxDeliveryCoefExpr,
    box_delivery_liter: item.boxDeliveryLiter,
    box_delivery_marketplace_base: item.boxDeliveryMarketplaceBase,
    box_delivery_marketplace_coef_expr: item.boxDeliveryMarketplaceCoefExpr,
    box_delivery_marketplace_liter: item.boxDeliveryMarketplaceLiter,
    box_storage_base: item.boxStorageBase,
    box_storage_coef_expr: item.boxStorageCoefExpr,
    box_storage_liter: item.boxStorageLiter,
  }));

 return  await wbpriceRepo.saveAll(list);
}


export async function fetchAndSavePrices(today: string) {
  const prices = await fetchWbPrices(today);
   return  await savePrices(today, prices);
}






  export default {
    fetchWbPrices,
    savePrices,
    fetchAndSavePrices
  }

