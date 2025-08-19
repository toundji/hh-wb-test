/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("wb_prices_sheets", (table) => {
        table.increments("id").primary();

        table.string("code").notNullable();
        table.string("date").notNullable();

        
        table.decimal("box_delivery_and_storage_expr", 10, 2).nullable();
        table.decimal("box_delivery_base", 10, 2).nullable();
        table.decimal("box_delivery_coef_expr", 10, 2).nullable();
        table.decimal("box_delivery_liter", 10, 2).nullable();
        
        table.decimal("box_delivery_marketplace_base", 10, 2).nullable();
        table.decimal("box_delivery_marketplace_coef_expr", 10, 2).nullable();
        table.decimal("box_delivery_marketplace_liter", 10, 2).nullable();
        
        table.decimal("box_storage_base", 10, 4).nullable();
        table.decimal("box_storage_coef_expr", 10, 2).nullable();
        table.decimal("box_storage_liter", 10, 4).nullable();
        
        table.string("geo_name").notNullable();
        table.string("warehouse_name").notNullable();
        
        table.timestamps(true, true);

        table.unique(["code", "date"]);
        
        });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable('wb_prices_sheets');
}
