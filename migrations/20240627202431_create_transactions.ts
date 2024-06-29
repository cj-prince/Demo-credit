import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");

  return knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("wallet_id").notNullable().unique();
    table.string("user_id").notNullable().unique();
    table.decimal("amount").notNullable();
    table.string("currency").defaultTo("NGN");
    table.string("recipient_wallet_name").notNullable();
    table.string("recipient_wallet_number").notNullable();
    table.string("recipient_user_id").notNullable();
    table.string("sender_name").notNullable();
    table.string("sender_bank").notNullable();
    table.enu("type", ["fund", "transfer", "withdraw"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
