// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertGroupCategory,
	insertIdolGroup,
	insertQuiz,
	insertQuizChoice,
	insertScoreTier,
	insertUser,
	NOW,
	setupBaseData,
} from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

describe("auth_identities の制約", () => {
	beforeEach(async () => await insertUser(db));
	const ins = (id: string, provider: string, sub: string) =>
		db
			.prepare("INSERT INTO auth_identities (auth_identity_id, user_id, provider, provider_subject_id, created_at, updated_at) VALUES (?,?,?,?,?,?)")
			.run(id, "user-1", provider, sub, NOW, NOW);

	it("unique(provider, provider_subject_id)", () => {
		ins("a1", "google", "s1");
		expect(() => ins("a2", "google", "s1")).toThrow();
	});
	it("異なるプロバイダなら同じ subject_id で登録可", () => {
		ins("a1", "google", "s1");
		expect(() => ins("a2", "line", "s1")).not.toThrow();
	});
	it("user_id は NOT NULL", () => {
		expect(() =>
			db
				.prepare(
					"INSERT INTO auth_identities (auth_identity_id, user_id, provider, provider_subject_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
				)
				.run("a1", null, "g", "s", NOW, NOW),
		).toThrow();
	});
});

describe("user_profiles の制約", () => {
	beforeEach(async () => {
		await insertUser(db);
		await insertUser(db, { userId: "user-2" });
	});
	it("handle は一意", () => {
		db.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)").run(
			"user-1",
			"h1",
			"U1",
			NOW,
			NOW,
		);
		expect(() =>
			db
				.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)")
				.run("user-2", "h1", "U2", NOW, NOW),
		).toThrow();
	});
});

describe("users の enum 制約", () => {
	it("不正な status を拒否", async () => {
		await expect(insertUser(db, { status: "banned" })).rejects.toThrow();
	});
	it("正当な status を受理", async () => {
		await insertUser(db, { userId: "a", status: "active" });
		await insertUser(db, { userId: "s", status: "suspended" });
		await insertUser(db, { userId: "d", status: "deleted" });
		expect((db.prepare("SELECT count(*) as c FROM users").get() as { c: number }).c).toBe(3);
	});
});

describe("idol_groups の制約", () => {
	beforeEach(async () => await insertGroupCategory(db));
	it("slug は一意", async () => {
		await insertIdolGroup(db, { idolGroupId: "g1", slug: "tw" });
		await expect(insertIdolGroup(db, { idolGroupId: "g2", slug: "tw" })).rejects.toThrow();
	});
	it("不正な status を拒否", () => {
		expect(() =>
			db
				.prepare(
					"INSERT INTO idol_groups (idol_group_id, group_category_id, slug, group_name, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?)",
				)
				.run("g1", "cat-1", "t", "T", "deleted", NOW, NOW),
		).toThrow();
	});
});

describe("user_favorite_groups の制約", () => {
	beforeEach(async () => await setupBaseData(db));
	it("unique(user_id, idol_group_id)", () => {
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"f1",
			"user-1",
			"group-1",
			NOW,
		);
		expect(() =>
			db
				.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)")
				.run("f2", "user-1", "group-1", NOW),
		).toThrow();
	});
});

describe("quiz_choices の制約", () => {
	beforeEach(async () => {
		await setupBaseData(db);
		await insertQuiz(db);
	});
	it("unique(quiz_id, choice_order)", async () => {
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1 });
		await expect(insertQuizChoice(db, { quizChoiceId: "c2", choiceOrder: 1 })).rejects.toThrow();
	});
	it("choice_order >= 1", async () => {
		await expect(insertQuizChoice(db, { choiceOrder: 0 })).rejects.toThrow();
	});
	it("is_correct は 0 or 1", async () => {
		await expect(insertQuizChoice(db, { isCorrect: 2 })).rejects.toThrow();
	});
});

describe("score_tiers の制約", () => {
	it("min_score <= max_score", async () => {
		await expect(insertScoreTier(db, { minScore: 200, maxScore: 100 })).rejects.toThrow();
	});
	it("tier_scope は overall/group のみ", async () => {
		await expect(insertScoreTier(db, { tierScope: "x" })).rejects.toThrow();
	});
	it("unique(tier_scope, tier_name)", async () => {
		await insertScoreTier(db, { scoreTierId: "t1" });
		await expect(insertScoreTier(db, { scoreTierId: "t2" })).rejects.toThrow();
	});
});

describe("drop_transactions の制約", () => {
	beforeEach(async () => await insertUser(db));
	const ins = (id: string, delta: number) =>
		db
			.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)")
			.run(id, "user-1", delta, "r", "s", NOW);
	it("delta != 0", () => {
		expect(() => ins("t1", 0)).toThrow();
	});
	it("正の delta を受理", () => {
		expect(() => ins("t1", 10)).not.toThrow();
	});
	it("負の delta を受理", () => {
		expect(() => ins("t1", -5)).not.toThrow();
	});
});

describe("drop_wallets の制約", () => {
	beforeEach(async () => await insertUser(db));
	it("balance >= 0", () => {
		expect(() => db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", -1, NOW)).toThrow();
	});
	it("balance = 0 は許容", () => {
		expect(() => db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 0, NOW)).not.toThrow();
	});
});

describe("events の制約", () => {
	beforeEach(async () => await insertUser(db));
	const ins = (o: { visibility?: string; capacity?: number | null; starts?: string; ends?: string }) =>
		db
			.prepare(
				"INSERT INTO events (event_id, created_by_user_id, title, visibility, capacity, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
			)
			.run(
				`ev-${Math.random()}`,
				"user-1",
				"E",
				o.visibility ?? "public",
				o.capacity ?? null,
				o.starts ?? "2025-03-01T00:00:00Z",
				o.ends ?? "2025-04-01T00:00:00Z",
				NOW,
				NOW,
			);
	it("ends_at >= starts_at", () => {
		expect(() => ins({ ends: "2025-02-01T00:00:00Z" })).toThrow();
	});
	it("ends_at = starts_at は許容", () => {
		expect(() => ins({ starts: "2025-03-01T00:00:00Z", ends: "2025-03-01T00:00:00Z" })).not.toThrow();
	});
	it("capacity は NULL or > 0", () => {
		expect(() => ins({ capacity: 0 })).toThrow();
	});
	it("不正な visibility を拒否", () => {
		expect(() => ins({ visibility: "secret" })).toThrow();
	});
});

describe("quizzes の enum 制約", () => {
	beforeEach(async () => await setupBaseData(db));
	it("不正な difficulty を拒否", async () => {
		await expect(insertQuiz(db, { difficulty: "extreme" })).rejects.toThrow();
	});
	it("不正な status を拒否", async () => {
		await expect(insertQuiz(db, { status: "deleted" })).rejects.toThrow();
	});
});

describe("group_categories の制約", () => {
	it("slug は一意", async () => {
		await insertGroupCategory(db, { groupCategoryId: "c1", slug: "kpop" });
		await expect(insertGroupCategory(db, { groupCategoryId: "c2", slug: "kpop" })).rejects.toThrow();
	});
});

describe("event_participants の制約", () => {
	beforeEach(async () => {
		await setupBaseData(db);
		db.prepare(
			"INSERT INTO events (event_id, created_by_user_id, title, visibility, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
		).run("ev-1", "user-1", "E", "public", "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW);
	});
	it("不正な participation_status を拒否", () => {
		expect(() =>
			db
				.prepare(
					"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
				)
				.run("ep-1", "ev-1", "user-1", "pending", NOW, NOW),
		).toThrow();
	});
});
