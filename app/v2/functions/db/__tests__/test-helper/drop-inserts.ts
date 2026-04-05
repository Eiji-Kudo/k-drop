import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";

type DropWalletInsert = Partial<InferInsertModel<typeof schema.dropWallets>>;
type DropTransactionInsert = Partial<InferInsertModel<typeof schema.dropTransactions>>;

export async function insertDropWallet(sqliteDb: TestDb, values: DropWalletInsert = {}) {
	return getTestFactories(sqliteDb).dropWallets.create({
		userId: values.userId ?? "user-1",
		balance: values.balance ?? 0,
		updatedAt: values.updatedAt ?? NOW,
	});
}

export async function insertDropTransaction(sqliteDb: TestDb, values: DropTransactionInsert = {}) {
	return getTestFactories(sqliteDb).dropTransactions.create({
		dropTransactionId: values.dropTransactionId ?? "drop-tx-1",
		userId: values.userId ?? "user-1",
		delta: values.delta ?? 10,
		reason: values.reason ?? "reward",
		sourceType: values.sourceType ?? "system",
		sourceId: values.sourceId ?? null,
		createdAt: values.createdAt ?? NOW,
	});
}
