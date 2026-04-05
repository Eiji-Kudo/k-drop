import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users.ts";

export const dropWallets = sqliteTable(
	"drop_wallets",
	{
		userId: text("user_id")
			.primaryKey()
			.references(() => users.userId, { onDelete: "cascade" }),
		balance: integer("balance").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [check("drop_wallets_balance_min", sql`${table.balance} >= 0`)],
);

export const dropTransactions = sqliteTable(
	"drop_transactions",
	{
		dropTransactionId: text("drop_transaction_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		delta: integer("delta").notNull(),
		reason: text("reason").notNull(),
		sourceType: text("source_type").notNull(),
		sourceId: text("source_id"),
		createdAt: text("created_at").notNull(),
	},
	(table) => [
		index("drop_transactions_user_id_idx").on(table.userId, table.createdAt),
		check("drop_transactions_delta_nonzero", sql`${table.delta} <> 0`),
	],
);
