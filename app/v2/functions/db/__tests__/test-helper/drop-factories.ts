import { type DefineFactoryResolver, defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { NOW } from "./constants";

export const dropWalletsFactory = defineFactory({
	schema,
	table: "dropWallets",
	resolver: ({ use: related }) => ({
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		balance: 0,
		updatedAt: NOW,
	}),
	traits: {
		base: (() => ({
			userId: "user-1",
			balance: 0,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "dropWallets">,
	},
});

export const dropTransactionsFactory = defineFactory({
	schema,
	table: "dropTransactions",
	resolver: ({ sequence, use: related }) => ({
		dropTransactionId: `drop-tx-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		delta: 10,
		reason: `reason-${sequence}`,
		sourceType: "system",
		sourceId: null,
		createdAt: NOW,
	}),
	traits: {
		base: (() => ({
			dropTransactionId: "drop-tx-1",
			userId: "user-1",
			delta: 10,
			reason: "reward",
			sourceType: "system",
			sourceId: null,
			createdAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "dropTransactions">,
	},
});
