import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");

  return knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table
      .uuid("wallet_id")
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("amount").notNullable();
    table.string("currency").defaultTo("NGN");
    table.string("recipient_wallet_name").nullable();
    table.string("recipient_wallet_number").nullable();
    table.string("sender_name").nullable();
    table.enu("type", ["fund", "transfer", "withdraw"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
