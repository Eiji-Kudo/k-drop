BEGIN;

ALTER TABLE public.app_user RENAME TO app_users;
ALTER SEQUENCE IF EXISTS public.app_user_app_user_id_seq RENAME TO app_users_app_user_id_seq;
ALTER TABLE public.app_users ALTER COLUMN app_user_id SET DEFAULT nextval('public.app_users_app_user_id_seq'::regclass);

ALTER TABLE public.event RENAME TO events;
ALTER SEQUENCE IF EXISTS public.event_event_id_seq RENAME TO events_event_id_seq;
ALTER TABLE public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);

ALTER TABLE public.event_group_participation RENAME TO event_group_participations;
ALTER SEQUENCE IF EXISTS public.event_group_participation_event_group_participation_id_seq RENAME TO event_group_participations_event_group_participation_id_seq;
ALTER TABLE public.event_group_participations ALTER COLUMN event_group_participation_id SET DEFAULT nextval('public.event_group_participations_event_group_participation_id_seq'::regclass);

ALTER TABLE public.event_participation RENAME TO event_participations;
ALTER SEQUENCE IF EXISTS public.event_participation_event_participation_id_seq RENAME TO event_participations_event_participation_id_seq;
ALTER TABLE public.event_participations ALTER COLUMN event_participation_id SET DEFAULT nextval('public.event_participations_event_participation_id_seq'::regclass);

ALTER TABLE public.group_category RENAME TO group_categories;
ALTER SEQUENCE IF EXISTS public.group_category_group_category_id_seq RENAME TO group_categories_group_category_id_seq;
ALTER TABLE public.group_categories ALTER COLUMN group_category_id SET DEFAULT nextval('public.group_categories_group_category_id_seq'::regclass);

ALTER TABLE public.group_otaku_layer RENAME TO group_otaku_layers;
ALTER SEQUENCE IF EXISTS public.group_otaku_layer_group_otaku_layer_id_seq RENAME TO group_otaku_layers_group_otaku_layer_id_seq;
ALTER TABLE public.group_otaku_layers ALTER COLUMN group_otaku_layer_id SET DEFAULT nextval('public.group_otaku_layers_group_otaku_layer_id_seq'::regclass);

ALTER TABLE public.idol_group RENAME TO idol_groups;
ALTER SEQUENCE IF EXISTS public.idol_group_idol_group_id_seq RENAME TO idol_groups_idol_group_id_seq;
ALTER TABLE public.idol_groups ALTER COLUMN idol_group_id SET DEFAULT nextval('public.idol_groups_idol_group_id_seq'::regclass);

ALTER TABLE public.monthly_score_history RENAME TO monthly_score_histories;
ALTER SEQUENCE IF EXISTS public.monthly_score_history_monthly_score_history_id_seq RENAME TO monthly_score_histories_monthly_score_history_id_seq;
ALTER TABLE public.monthly_score_histories ALTER COLUMN monthly_score_history_id SET DEFAULT nextval('public.monthly_score_histories_monthly_score_history_id_seq'::regclass);

ALTER TABLE public.quiz RENAME TO quizzes;
ALTER SEQUENCE IF EXISTS public.quiz_quiz_id_seq RENAME TO quizzes_quiz_id_seq;
ALTER TABLE public.quizzes ALTER COLUMN quiz_id SET DEFAULT nextval('public.quizzes_quiz_id_seq'::regclass);

ALTER TABLE public.quiz_difficulty RENAME TO quiz_difficulties;
ALTER SEQUENCE IF EXISTS public.quiz_difficulty_quiz_difficulty_id_seq RENAME TO quiz_difficulties_quiz_difficulty_id_seq;
ALTER TABLE public.quiz_difficulties ALTER COLUMN quiz_difficulty_id SET DEFAULT nextval('public.quiz_difficulties_quiz_difficulty_id_seq'::regclass);

ALTER TABLE public.ranking_group RENAME TO ranking_groups;
ALTER SEQUENCE IF EXISTS public.ranking_group_ranking_group_id_seq RENAME TO ranking_groups_ranking_group_id_seq;
ALTER TABLE public.ranking_groups ALTER COLUMN ranking_group_id SET DEFAULT nextval('public.ranking_groups_ranking_group_id_seq'::regclass);

ALTER TABLE public.ranking_total RENAME TO ranking_totals;
ALTER SEQUENCE IF EXISTS public.ranking_total_ranking_total_id_seq RENAME TO ranking_totals_ranking_total_id_seq;
ALTER TABLE public.ranking_totals ALTER COLUMN ranking_total_id SET DEFAULT nextval('public.ranking_totals_ranking_total_id_seq'::regclass);

ALTER TABLE public.total_otaku_layer RENAME TO total_otaku_layers;
ALTER SEQUENCE IF EXISTS public.total_otaku_layer_total_otaku_layer_id_seq RENAME TO total_otaku_layers_total_otaku_layer_id_seq;
ALTER TABLE public.total_otaku_layers ALTER COLUMN total_otaku_layer_id SET DEFAULT nextval('public.total_otaku_layers_total_otaku_layer_id_seq'::regclass);

ALTER TABLE public.user_idol_group_score RENAME TO user_idol_group_scores;
ALTER SEQUENCE IF EXISTS public.user_idol_group_score_user_idol_group_score_id_seq RENAME TO user_idol_group_scores_user_idol_group_score_id_seq;
ALTER TABLE public.user_idol_group_scores ALTER COLUMN user_idol_group_score_id SET DEFAULT nextval('public.user_idol_group_scores_user_idol_group_score_id_seq'::regclass);

ALTER TABLE public.user_profile RENAME TO user_profiles;
ALTER SEQUENCE IF EXISTS public.user_profile_user_profile_id_seq RENAME TO user_profiles_user_profile_id_seq;
ALTER TABLE public.user_profiles ALTER COLUMN user_profile_id SET DEFAULT nextval('public.user_profiles_user_profile_id_seq'::regclass);

ALTER TABLE public.user_quiz_answer RENAME TO user_quiz_answers;
ALTER SEQUENCE IF EXISTS public.user_quiz_answer_user_quiz_answer_id_seq RENAME TO user_quiz_answers_user_quiz_answer_id_seq;
ALTER TABLE public.user_quiz_answers ALTER COLUMN user_quiz_answer_id SET DEFAULT nextval('public.user_quiz_answers_user_quiz_answer_id_seq'::regclass);

COMMIT;