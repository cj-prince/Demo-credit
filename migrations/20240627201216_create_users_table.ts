import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");

  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("phone_number").notNullable();
    table.string("country").defaultTo("NGN");
    table.string("country_code").defaultTo("234");
    table.string("terms_and_conditions").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
