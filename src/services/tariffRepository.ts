import axios from "axios";
import  priceRepo from "#repository/wbprice.repo.js"
import { WbPriceDbDto, WbPriceDto } from "#dto/price.dto.js";
import dateFormat from "dateformat";

 async function fetchAndSavePrices() {

    const url = "http://localhost:3000/wb"; // json-server
    const response = await axios.get(url);
    const warehouses = response.data?.data?.warehouseList ?? [];

    const date = dateFormat(new Date(), 'YYYY-MM-DD');

    const rows:WbPriceDbDto[] = warehouses.map((item: WbPriceDto) => ({
        code: `${item.warehouseName}_${item.geoName}`,
        fetched_at: date,
        warehouse_name: item.warehouseName,
        geo_name: item.geoName,


        box_delivery_and_storage_expr: parseFloat(item.boxDeliveryAndStorageExpr?.replace(",", ".")) || undefined,
        box_delivery_base: parseFloat(item.boxDeliveryBase?.replace(",", ".")) || undefined,
        box_delivery_coef_expr: parseFloat(item.boxDeliveryCoefExpr?.replace(",", ".")) || undefined,
        box_delivery_liter: parseFloat(item.boxDeliveryLiter?.replace(",", ".")) || undefined,
        box_delivery_marketplace_base: parseFloat(item.boxDeliveryMarketplaceBase?.replace(",", ".")) || undefined,
        box_delivery_marketplace_coef_expr: parseFloat(item.boxDeliveryMarketplaceCoefExpr?.replace(",", ".")) || undefined,
        box_delivery_marketplace_liter: parseFloat(item.boxDeliveryMarketplaceLiter?.replace(",", ".")) || undefined,
        box_storage_base: parseFloat(item.boxStorageBase?.replace(",", ".")) || undefined,
        box_storage_coef_expr: parseFloat(item.boxStorageCoefExpr?.replace(",", ".")) || undefined,
        box_storage_liter: parseFloat(item.boxStorageLiter?.replace(",", ".")) || undefined,

         }));

    await priceRepo.saveAll(rows).catch(error=>{
        console.log(error);
    });
    

    console.log(`✅ WB Prices saved (${warehouses.length} rows)`);
  }



  export default {
        fetchAndSavePrices,
  }

