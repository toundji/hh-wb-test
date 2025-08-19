import { WbPriceDb, WbPriceDbDto } from "#dto/price.dto.js";
import knex from "#postgres/knex.js";

function save(data: WbPriceDbDto) : Promise<WbPriceDb> {
    return knex("wb_prices").insert<WbPriceDb>(data)
    .onConflict(["code", "fetched_at"]).merge();
}

async function saveAll( data: WbPriceDbDto[]): Promise<WbPriceDb[]> {
    return knex("wb_prices").insert<WbPriceDb[]>(data)
    .onConflict(["code", "fetched_at"]).merge();
}

async function findAll(): Promise<WbPriceDb[]> {
    return knex("wb_prices").select("*").orderBy("created_at", "desc");
}

async function findByCode(code: string): Promise<WbPriceDb[]> {
    return knex("wb_prices").select("*").where({ code }).orderBy("fetched_at", "desc");
}

export default {
    save,
    saveAll,
    findAll,
    findByCode,
};
