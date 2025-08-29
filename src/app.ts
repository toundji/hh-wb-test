import knex, { migrate, seed } from "#postgres/knex.js";
import { schedulePriceWriten } from "#services/job.service.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");


schedulePriceWriten()

