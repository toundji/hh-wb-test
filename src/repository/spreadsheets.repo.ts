import { SpreadsheetDto } from "#dto/price.dto.js";
import knex from "#postgres/knex.js";


async function saveAll( data: string[]): Promise<SpreadsheetDto[]> {
    const body = data.map(ele=> {
         return {spreadsheet_id: ele};
         });
    return knex("spreadsheets").insert<SpreadsheetDto[]>(body)
     .onConflict(["spreadsheet_id"]).ignore();
}

async function findAll(): Promise<SpreadsheetDto[]> {
    return knex("spreadsheets").select("*");
}


export async function  listIds(): Promise<string[]>{
    const rows = await knex<SpreadsheetDto>("spreadsheets").select("spreadsheet_id");
    return rows.map(r => <string>r.spreadsheet_id);
}

export default {
    saveAll,
    findAll,
    listIds,
};
