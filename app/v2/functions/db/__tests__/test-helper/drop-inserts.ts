import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { ensureBaseUser } from "./base-fixtures";
import { getTestFactories, type TestDb } from "./db";

type DropWalletInsert = Partial<InferInsertModel<typeof schema.dropWallets>>;
type DropTransactionInsert = Partial<InferInsertModel<typeof schema.dropTransactions>>;

export async function insertDropWallet(sqliteDb: TestDb, values: DropWalletInsert = {}) {
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	return getTestFactories(sqliteDb).dropWallets.traits.base.create(values);
}

export async function insertDropTransaction(sqliteDb: TestDb, values: DropTransactionInsert = {}) {
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	return getTestFactories(sqliteDb).dropTransactions.traits.base.create(values);
}
