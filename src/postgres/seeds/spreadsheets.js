import googleConf from "#config/env/google.config.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: googleConf.DEFAULT_SPREADSHEETS_ID }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
