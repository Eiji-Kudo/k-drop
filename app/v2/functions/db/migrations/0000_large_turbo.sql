CREATE TABLE `drop_transactions` (
	`drop_transaction_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`delta` integer NOT NULL,
	`reason` text NOT NULL,
	`source_type` text NOT NULL,
	`source_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "drop_transactions_delta_nonzero" CHECK("drop_transactions"."delta" <> 0)
);
--> statement-breakpoint
CREATE INDEX `drop_transactions_user_id_idx` ON `drop_transactions` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `drop_wallets` (
	`user_id` text PRIMARY KEY NOT NULL,
	`balance` integer NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "drop_wallets_balance_min" CHECK("drop_wallets"."balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE `event_groups` (
	`event_group_id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`idol_group_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `event_groups_idol_group_id_idx` ON `event_groups` (`idol_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_groups_event_id_idol_group_id_unique` ON `event_groups` (`event_id`,`idol_group_id`);--> statement-breakpoint
CREATE TABLE `event_participants` (
	`event_participant_id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`participation_status` text NOT NULL,
	`joined_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `event_participants_user_id_idx` ON `event_participants` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_participants_event_id_user_id_unique` ON `event_participants` (`event_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`created_by_user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`venue_name` text,
	`visibility` text NOT NULL,
	`capacity` integer,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "events_capacity_check" CHECK("events"."capacity" IS NULL OR "events"."capacity" > 0),
	CONSTRAINT "events_dates_check" CHECK("events"."ends_at" >= "events"."starts_at")
);
--> statement-breakpoint
CREATE INDEX `events_created_by_user_id_idx` ON `events` (`created_by_user_id`);--> statement-breakpoint
CREATE TABLE `group_categories` (
	`group_category_id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`category_name` text NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_categories_slug_unique` ON `group_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `idol_groups` (
	`idol_group_id` text PRIMARY KEY NOT NULL,
	`group_category_id` text NOT NULL,
	`slug` text NOT NULL,
	`group_name` text NOT NULL,
	`thumbnail_url` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`group_category_id`) REFERENCES `group_categories`(`group_category_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "idol_groups_status_check" CHECK("idol_groups"."status" IN ('active', 'inactive', 'archived'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idol_groups_slug_unique` ON `idol_groups` (`slug`);--> statement-breakpoint
CREATE INDEX `idol_groups_group_category_id_idx` ON `idol_groups` (`group_category_id`);--> statement-breakpoint
CREATE TABLE `user_favorite_groups` (
	`user_favorite_group_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`idol_group_id` text NOT NULL,
	`started_supporting_on` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_favorite_groups_idol_group_id_idx` ON `user_favorite_groups` (`idol_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_favorite_groups_user_id_idol_group_id_unique` ON `user_favorite_groups` (`user_id`,`idol_group_id`);--> statement-breakpoint
CREATE TABLE `leaderboard_entries` (
	`leaderboard_entry_id` text PRIMARY KEY NOT NULL,
	`leaderboard_snapshot_id` text NOT NULL,
	`user_id` text NOT NULL,
	`display_rank` integer NOT NULL,
	`display_score` integer NOT NULL,
	FOREIGN KEY (`leaderboard_snapshot_id`) REFERENCES `leaderboard_snapshots`(`leaderboard_snapshot_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "leaderboard_entries_display_rank_min" CHECK("leaderboard_entries"."display_rank" >= 1),
	CONSTRAINT "leaderboard_entries_display_score_min" CHECK("leaderboard_entries"."display_score" >= 0)
);
--> statement-breakpoint
CREATE INDEX `leaderboard_entries_user_id_idx` ON `leaderboard_entries` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_entries_leaderboard_snapshot_id_user_id_unique` ON `leaderboard_entries` (`leaderboard_snapshot_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_entries_leaderboard_snapshot_id_display_rank_unique` ON `leaderboard_entries` (`leaderboard_snapshot_id`,`display_rank`);--> statement-breakpoint
CREATE TABLE `leaderboard_snapshots` (
	`leaderboard_snapshot_id` text PRIMARY KEY NOT NULL,
	`leaderboard_scope` text NOT NULL,
	`idol_group_id` text,
	`snapshot_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `leaderboard_snapshots_idol_group_id_idx` ON `leaderboard_snapshots` (`idol_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_snapshots_overall_unique` ON `leaderboard_snapshots` (`leaderboard_scope`,`snapshot_at`) WHERE "leaderboard_snapshots"."idol_group_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_snapshots_group_unique` ON `leaderboard_snapshots` (`leaderboard_scope`,`idol_group_id`,`snapshot_at`) WHERE "leaderboard_snapshots"."idol_group_id" IS NOT NULL;--> statement-breakpoint
CREATE TABLE `quiz_answers` (
	`quiz_answer_id` text PRIMARY KEY NOT NULL,
	`quiz_session_question_id` text NOT NULL,
	`quiz_choice_id` text NOT NULL,
	`awarded_score` integer NOT NULL,
	`answered_at` text NOT NULL,
	FOREIGN KEY (`quiz_session_question_id`) REFERENCES `quiz_session_questions`(`quiz_session_question_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_choice_id`) REFERENCES `quiz_choices`(`quiz_choice_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "awarded_score_min" CHECK("quiz_answers"."awarded_score" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quiz_answers_quiz_session_question_id_unique` ON `quiz_answers` (`quiz_session_question_id`);--> statement-breakpoint
CREATE INDEX `quiz_answers_quiz_choice_id_idx` ON `quiz_answers` (`quiz_choice_id`);--> statement-breakpoint
CREATE TABLE `quiz_session_questions` (
	`quiz_session_question_id` text PRIMARY KEY NOT NULL,
	`quiz_session_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`question_order` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`quiz_session_id`) REFERENCES `quiz_sessions`(`quiz_session_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`quiz_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "question_order_min" CHECK("quiz_session_questions"."question_order" >= 1)
);
--> statement-breakpoint
CREATE INDEX `quiz_session_questions_quiz_id_idx` ON `quiz_session_questions` (`quiz_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quiz_session_questions_quiz_session_id_question_order_unique` ON `quiz_session_questions` (`quiz_session_id`,`question_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `quiz_session_questions_quiz_session_id_quiz_id_unique` ON `quiz_session_questions` (`quiz_session_id`,`quiz_id`);--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`quiz_session_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`idol_group_id` text NOT NULL,
	`status` text NOT NULL,
	`total_question_count` integer NOT NULL,
	`answered_question_count` integer NOT NULL,
	`correct_answer_count` integer NOT NULL,
	`incorrect_answer_count` integer NOT NULL,
	`current_question_order` integer,
	`started_at` text NOT NULL,
	`last_answered_at` text,
	`completed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "total_question_count_min" CHECK("quiz_sessions"."total_question_count" >= 1),
	CONSTRAINT "status_current_question_order" CHECK(("quiz_sessions"."status" = 'in_progress' AND "quiz_sessions"."current_question_order" IS NOT NULL) OR ("quiz_sessions"."status" IN ('completed', 'abandoned') AND "quiz_sessions"."current_question_order" IS NULL)),
	CONSTRAINT "completed_requires_completed_at" CHECK("quiz_sessions"."status" != 'completed' OR "quiz_sessions"."completed_at" IS NOT NULL),
	CONSTRAINT "non_completed_no_completed_at" CHECK("quiz_sessions"."status" = 'completed' OR "quiz_sessions"."completed_at" IS NULL),
	CONSTRAINT "answered_requires_last_answered_at" CHECK("quiz_sessions"."answered_question_count" = 0 OR "quiz_sessions"."last_answered_at" IS NOT NULL),
	CONSTRAINT "no_answer_no_last_answered_at" CHECK("quiz_sessions"."answered_question_count" > 0 OR "quiz_sessions"."last_answered_at" IS NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quiz_sessions_in_progress_per_user_group` ON `quiz_sessions` (`user_id`,`idol_group_id`) WHERE "quiz_sessions"."status" = 'in_progress';--> statement-breakpoint
CREATE INDEX `quiz_sessions_user_id_idx` ON `quiz_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `quiz_sessions_idol_group_id_idx` ON `quiz_sessions` (`idol_group_id`);--> statement-breakpoint
CREATE TABLE `quiz_choices` (
	`quiz_choice_id` text PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`choice_order` integer NOT NULL,
	`choice_text` text NOT NULL,
	`is_correct` integer NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`quiz_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quiz_choices_choice_order_min" CHECK("quiz_choices"."choice_order" >= 1),
	CONSTRAINT "quiz_choices_is_correct_bool" CHECK("quiz_choices"."is_correct" IN (0, 1))
);
--> statement-breakpoint
CREATE INDEX `quiz_choices_quiz_id_idx` ON `quiz_choices` (`quiz_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quiz_choices_quiz_id_choice_order_unique` ON `quiz_choices` (`quiz_id`,`choice_order`);--> statement-breakpoint
CREATE TABLE `quizzes` (
	`quiz_id` text PRIMARY KEY NOT NULL,
	`idol_group_id` text NOT NULL,
	`difficulty` text NOT NULL,
	`status` text NOT NULL,
	`prompt` text NOT NULL,
	`explanation` text,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_difficulty_check" CHECK("quizzes"."difficulty" IN ('easy', 'normal', 'hard')),
	CONSTRAINT "quizzes_status_check" CHECK("quizzes"."status" IN ('draft', 'published', 'archived'))
);
--> statement-breakpoint
CREATE INDEX `quizzes_idol_group_id_status_idx` ON `quizzes` (`idol_group_id`,`status`);--> statement-breakpoint
CREATE TABLE `score_tiers` (
	`score_tier_id` text PRIMARY KEY NOT NULL,
	`tier_scope` text NOT NULL,
	`tier_name` text NOT NULL,
	`min_score` integer NOT NULL,
	`max_score` integer NOT NULL,
	`sort_order` integer NOT NULL,
	CONSTRAINT "score_tiers_range_check" CHECK("score_tiers"."min_score" <= "score_tiers"."max_score")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `score_tiers_tier_scope_tier_name_unique` ON `score_tiers` (`tier_scope`,`tier_name`);--> statement-breakpoint
CREATE TABLE `user_score_snapshots` (
	`user_score_snapshot_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`score_scope` text NOT NULL,
	`idol_group_id` text,
	`snapshot_date` text NOT NULL,
	`score_total` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "user_score_snapshots_score_total_min" CHECK("user_score_snapshots"."score_total" >= 0),
	CONSTRAINT "user_score_snapshots_scope_group_match" CHECK(("user_score_snapshots"."score_scope" = 'overall' AND "user_score_snapshots"."idol_group_id" IS NULL) OR ("user_score_snapshots"."score_scope" = 'group' AND "user_score_snapshots"."idol_group_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_score_snapshots_overall_scope` ON `user_score_snapshots` (`user_id`,`score_scope`,`snapshot_date`) WHERE "user_score_snapshots"."idol_group_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_score_snapshots_group_scope` ON `user_score_snapshots` (`user_id`,`score_scope`,`idol_group_id`,`snapshot_date`) WHERE "user_score_snapshots"."idol_group_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX `user_score_snapshots_user_id_idx` ON `user_score_snapshots` (`user_id`,`snapshot_date`);--> statement-breakpoint
CREATE TABLE `user_score_states` (
	`user_score_state_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`score_scope` text NOT NULL,
	`idol_group_id` text,
	`score_tier_id` text NOT NULL,
	`score_total` integer NOT NULL,
	`answered_count` integer NOT NULL,
	`correct_count` integer NOT NULL,
	`last_answered_at` text,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idol_group_id`) REFERENCES `idol_groups`(`idol_group_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`score_tier_id`) REFERENCES `score_tiers`(`score_tier_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_score_states_score_total_min" CHECK("user_score_states"."score_total" >= 0),
	CONSTRAINT "user_score_states_answered_count_min" CHECK("user_score_states"."answered_count" >= 0),
	CONSTRAINT "user_score_states_correct_count_min" CHECK("user_score_states"."correct_count" >= 0),
	CONSTRAINT "user_score_states_correct_le_answered" CHECK("user_score_states"."correct_count" <= "user_score_states"."answered_count"),
	CONSTRAINT "user_score_states_scope_group_match" CHECK(("user_score_states"."score_scope" = 'overall' AND "user_score_states"."idol_group_id" IS NULL) OR ("user_score_states"."score_scope" = 'group' AND "user_score_states"."idol_group_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_score_states_overall_scope` ON `user_score_states` (`user_id`,`score_scope`) WHERE "user_score_states"."idol_group_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_score_states_group_scope` ON `user_score_states` (`user_id`,`score_scope`,`idol_group_id`) WHERE "user_score_states"."idol_group_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX `user_score_states_score_tier_id_idx` ON `user_score_states` (`score_tier_id`);--> statement-breakpoint
CREATE TABLE `auth_identities` (
	`auth_identity_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_subject_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `auth_identities_user_id_idx` ON `auth_identities` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_identities_provider_provider_subject_id_unique` ON `auth_identities` (`provider`,`provider_subject_id`);--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`handle` text NOT NULL,
	`display_name` text NOT NULL,
	`avatar_url` text,
	`bio` text,
	`fan_since` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_handle_unique` ON `user_profiles` (`handle`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "users_status_check" CHECK("users"."status" IN ('active', 'suspended', 'deleted'))
);
