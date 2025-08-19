/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("wb_prices_sheets")
        .insert([
            {
                code: 'Центральный_федеральный_округ_Коледино',
                date: '2025-08-01',
                box_delivery_base: 63,
                box_delivery_coef_expr: 180,
                box_delivery_liter: 15.3,
                box_storage_base: 0.1,
                box_storage_coef_expr: 145,
                box_storage_liter: 0.1,
                geo_name: "Центральный федеральный округ",
                warehouse_name: "Коледино"
              },
              {
                code: 'Центральный_федеральный_округ_Сабурово',
                date: '2025-08-01',
                box_delivery_base: 45.5,
                box_delivery_coef_expr: 130,
                box_delivery_liter: 11.05,
                box_storage_base: 0.09,
                box_storage_coef_expr: 130,
                box_storage_liter: 0.09,
                geo_name: "Центральный федеральный округ",
                warehouse_name: "Сабурово"
              }
        ])
        .onConflict(["id"])
        .ignore();
}
