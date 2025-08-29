
import spreadsheetsRepo from "#repository/spreadsheets.repo.js";
import wbpriceRepo from "#repository/wbprice.repo.js";
import { GaxiosError } from "googleapis-common";
import { WbPriceDb } from "#dto/price.dto.js";
import { numToString } from "#utils/util.js";
import pLimit from "p-limit";
import { sheets } from "#repository/sheetsclient.js";

const SHEET_TITLE = "stocks_coefs";

export async function createSheet(spreadsheetId: string) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        { addSheet: { properties: { title: SHEET_TITLE } } },
      ],
    },
  });
}

export function toSheetRows(priceList: WbPriceDb[]) {
  const header = [
    "warehouseName",
    "geoName",
    "boxDeliveryBase",
    "boxDeliveryCoefExpr",
    "boxDeliveryLiter",
    "boxDeliveryMarketplaceBase",
    "boxDeliveryMarketplaceCoefExpr",
    "boxDeliveryMarketplaceLiter",
    "boxStorageBase",
    "boxStorageCoefExpr",
    "boxStorageLiter",
    "date",
  ];

  const sheetRows = priceList.map(r => [
    r.warehouse_name,
    r.geo_name,
    numToString(r.box_delivery_base),
    numToString(r.box_delivery_coef_expr),
    numToString(r.box_delivery_liter),
    numToString(r.box_delivery_marketplace_base),
    numToString(r.box_delivery_marketplace_coef_expr),
    numToString(r.box_delivery_marketplace_liter),
    numToString(r.box_storage_base),
    numToString(r.box_storage_coef_expr),
    numToString(r.box_storage_liter),
    r.date,
  ]);

  return [header, ...sheetRows];
}


export async function writeSheet(spreadsheetId: string, values: (string | number)[][]) {
  try {
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: SHEET_TITLE });
  } catch (error: unknown) {
    if (error instanceof GaxiosError) {
      if ([401, 403].includes(Number(error.code))) {
        console.error(`Auth error for ${spreadsheetId}: ${error.message}`);
        throw `Auth error for ${spreadsheetId}: ${error.message}`;
      }
      if ([400, 404].includes(Number(error.code))) {
        console.warn(`Sheet ${SHEET_TITLE} not found in ${spreadsheetId}, creating...`);
        try {
          await createSheet(spreadsheetId);
        } catch (err) {
          console.error(`Unable to create sheet in ${spreadsheetId}: ${err}`);
          return;
        }
      }
    } else {
      console.error(`Unexpected error clearing sheet ${spreadsheetId}:`, error);
      return;
    }
  }

  let retries = 3;

  while (retries > 0) {
    try {
        return await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_TITLE}!A1`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        }).then(value=>{
          console.log(`Sheet ${spreadsheetId} successful writted`);
          return value;
        });
        
      } catch (err: unknown) {
        if (err instanceof GaxiosError && Number(err.code) === 429) {
          await new Promise(r => setTimeout(r, (4 - retries) * 1000)); 
          retries--;
        } else {
          console.error(`Unable to write in sheet ${spreadsheetId}:`, err);
          return;
        }
      }
  }

  
}


export async function syncAllSheetsForDay(date: string) {
  const [spreadsheets_ids, rows] = await Promise.all([
    spreadsheetsRepo.listIds(),
    wbpriceRepo.getByDateSortedByCoefAsc(date),
  ]);


  const values = toSheetRows(rows);
  const limit = pLimit(10); 

  const results =  await Promise.all(spreadsheets_ids.map(id => limit(() => writeSheet(id, values)))).then(value=>{
    console.log("all sheet successfull writted");
    return value;
  });

  return results;


}




