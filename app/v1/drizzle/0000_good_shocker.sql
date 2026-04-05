-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "group_categories" (
	"group_category_id" serial PRIMARY KEY NOT NULL,
	"category_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idol_groups" (
	"idol_group_id" serial PRIMARY KEY NOT NULL,
	"group_category_id" integer NOT NULL,
	"idol_group_name" text NOT NULL,
	"thumbnail_image" text
);
--> statement-breakpoint
CREATE TABLE "app_users" (
	"app_user_id" serial PRIMARY KEY NOT NULL,
	"supabase_uuid" uuid NOT NULL,
	"line_account_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_otaku_layers" (
	"group_otaku_layer_id" serial PRIMARY KEY NOT NULL,
	"layer_name" text NOT NULL,
	"min_score" integer NOT NULL,
	"max_score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"quiz_id" serial PRIMARY KEY NOT NULL,
	"idol_group_id" integer NOT NULL,
	"quiz_difficulty_id" integer NOT NULL,
	"prompt" text NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_difficulties" (
	"quiz_difficulty_id" serial PRIMARY KEY NOT NULL,
	"difficulty_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "total_otaku_layers" (
	"total_otaku_layer_id" serial PRIMARY KEY NOT NULL,
	"layer_name" text NOT NULL,
	"min_score" integer NOT NULL,
	"max_score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_score_histories" (
	"monthly_score_history_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"month" timestamp with time zone NOT NULL,
	"score_snapshot" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"created_by" integer NOT NULL,
	"event_name" text NOT NULL,
	"event_description" text NOT NULL,
	"location" text NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_group_participations" (
	"event_group_participation_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"idol_group_id" integer NOT NULL,
	"registered_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_participations" (
	"event_participation_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"app_user_id" integer NOT NULL,
	"joined_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranking_groups" (
	"ranking_group_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"idol_group_id" integer NOT NULL,
	"display_rank" integer NOT NULL,
	"display_score" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranking_totals" (
	"ranking_total_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"display_rank" integer NOT NULL,
	"display_score" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_idol_group_scores" (
	"user_idol_group_score_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"idol_group_id" integer NOT NULL,
	"otaku_score" integer NOT NULL,
	"group_otaku_layer_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_profile_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"user_name" text NOT NULL,
	"total_otaku_score" integer NOT NULL,
	"remaining_drop" integer NOT NULL,
	"total_otaku_layer_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_quiz_answers" (
	"user_quiz_answer_id" serial PRIMARY KEY NOT NULL,
	"app_user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"selected_choice" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_choices" (
	"quiz_choice_id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"choice_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idol_groups" ADD CONSTRAINT "fk_group_category" FOREIGN KEY ("group_category_id") REFERENCES "public"."group_categories"("group_category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "fk_quiz_question_idol_group" FOREIGN KEY ("idol_group_id") REFERENCES "public"."idol_groups"("idol_group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "fk_quiz_question_quiz_difficulty" FOREIGN KEY ("quiz_difficulty_id") REFERENCES "public"."quiz_difficulties"("quiz_difficulty_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_score_histories" ADD CONSTRAINT "fk_monthly_score_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_event_created_by" FOREIGN KEY ("created_by") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_group_participations" ADD CONSTRAINT "fk_event_group_event" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_group_participations" ADD CONSTRAINT "fk_event_group_idol_group" FOREIGN KEY ("idol_group_id") REFERENCES "public"."idol_groups"("idol_group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participations" ADD CONSTRAINT "fk_event_participation_event" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participations" ADD CONSTRAINT "fk_event_participation_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranking_groups" ADD CONSTRAINT "fk_ranking_group_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranking_groups" ADD CONSTRAINT "fk_ranking_group_idol_group" FOREIGN KEY ("idol_group_id") REFERENCES "public"."idol_groups"("idol_group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranking_totals" ADD CONSTRAINT "fk_ranking_total_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_idol_group_scores" ADD CONSTRAINT "fk_user_idol_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_idol_group_scores" ADD CONSTRAINT "fk_user_idol_idol_group" FOREIGN KEY ("idol_group_id") REFERENCES "public"."idol_groups"("idol_group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_idol_group_scores" ADD CONSTRAINT "fk_user_idol_group_otaku_layer" FOREIGN KEY ("group_otaku_layer_id") REFERENCES "public"."group_otaku_layers"("group_otaku_layer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "fk_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "fk_total_otaku_layer" FOREIGN KEY ("total_otaku_layer_id") REFERENCES "public"."total_otaku_layers"("total_otaku_layer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "fk_user_quiz_app_user" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("app_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "fk_user_quiz" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_choices" ADD CONSTRAINT "quiz_choices_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_quiz_choices_quiz_id" ON "quiz_choices" USING btree ("quiz_id" int4_ops);
*/