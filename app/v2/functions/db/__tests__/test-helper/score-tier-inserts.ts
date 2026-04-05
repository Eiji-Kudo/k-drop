import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { getTestFactories, type TestDb } from "./db";
import { isScope } from "./types";

type ScoreTierInsert = Omit<Partial<InferInsertModel<typeof schema.scoreTiers>>, "tierScope"> & { tierScope?: string };

const insertScoreTierWithRawScope = (
	sqliteDb: TestDb,
	scoreTierId: string,
	tierScope: string,
	tierName: string,
	minScore: number,
	maxScore: number,
	sortOrder: number,
) => {
	sqliteDb
		.prepare("INSERT INTO score_tiers (score_tier_id, tier_scope, tier_name, min_score, max_score, sort_order) VALUES (?,?,?,?,?,?)")
		.run(scoreTierId, tierScope, tierName, minScore, maxScore, sortOrder);
	return scoreTierId;
};

export async function insertScoreTier(sqliteDb: TestDb, values: ScoreTierInsert = {}) {
	const tierScope = values.tierScope ?? "overall";
	const scoreTierId = values.scoreTierId ?? (tierScope === "group" ? "tier-group-1" : "tier-1");
	const tierName = values.tierName ?? "Bronze";
	const minScore = values.minScore ?? 0;
	const maxScore = values.maxScore ?? 100;
	const sortOrder = values.sortOrder ?? 1;
	if (!isScope(tierScope)) return insertScoreTierWithRawScope(sqliteDb, scoreTierId, tierScope, tierName, minScore, maxScore, sortOrder);
	const factories = getTestFactories(sqliteDb).scoreTiers;
	const tier: InferSelectModel<typeof schema.scoreTiers> =
		tierScope === "group"
			? await factories.traits.groupBase.create({ ...values, scoreTierId, tierScope, tierName, minScore, maxScore, sortOrder })
			: await factories.traits.base.create({ ...values, scoreTierId, tierScope, tierName, minScore, maxScore, sortOrder });
	return tier.scoreTierId;
}
