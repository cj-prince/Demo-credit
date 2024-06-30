import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");

  await knex.schema.createTable("wallets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("currency").defaultTo("NGN");
    table.string("wallet_name").notNullable();
    table.string("wallet_number").notNullable();
    table.decimal("balance", 15, 2).defaultTo(0);
    table.decimal("credit", 15, 2).defaultTo(0);
    table.decimal("debit", 15, 2).defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_balance_on_credit
    AFTER UPDATE ON wallets
    FOR EACH ROW
    BEGIN
      IF NEW.credit != OLD.credit THEN
        UPDATE wallets
        SET balance = balance + NEW.credit - OLD.credit
        WHERE id = NEW.id;
      END IF;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER update_balance_on_debit
    AFTER UPDATE ON wallets
    FOR EACH ROW
    BEGIN
      IF NEW.debit != OLD.debit THEN
        UPDATE wallets
        SET balance = balance - NEW.debit + OLD.debit
        WHERE id = NEW.id;
      END IF;
    END;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS update_balance_on_credit`);
  await knex.raw(`DROP TRIGGER IF EXISTS update_balance_on_debit`);
  return knex.schema.dropTable("wallets");
}
