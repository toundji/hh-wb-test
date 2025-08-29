import { WbPriceDb, WbPriceDbDto } from "#dto/price.dto.js";
import knex from "#postgres/knex.js";

async function saveAll( data: WbPriceDbDto[]): Promise<WbPriceDb[]> {
    return knex("wb_prices").insert<WbPriceDb[]>(data)
    .onConflict([ "date", "geo_name", "warehouse_name",]).merge();
}


export async function  getByDateSortedByCoefAsc (date: string): Promise<WbPriceDb[]>  {
    return knex<WbPriceDb>("wb_prices").select("*")
      .where({ date: date })
      .orderBy([{ column: "box_delivery_coef_expr", order: "asc" }]);
  }

export default {
    saveAll,
    getByDateSortedByCoefAsc,
};
