-- Add profile features to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS nickname text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS fan_since date,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create user_favorite_groups table
CREATE TABLE IF NOT EXISTS user_favorite_groups (
    user_favorite_group_id serial PRIMARY KEY,
    app_user_id integer NOT NULL REFERENCES app_users(app_user_id) ON DELETE CASCADE,
    idol_group_id integer NOT NULL REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
    fan_since date,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(app_user_id, idol_group_id)
);

-- Create daily_score_histories table
CREATE TABLE IF NOT EXISTS daily_score_histories (
    daily_score_history_id serial PRIMARY KEY,
    app_user_id integer NOT NULL REFERENCES app_users(app_user_id) ON DELETE CASCADE,
    date date NOT NULL,
    total_score integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(app_user_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_favorite_groups_app_user_id ON user_favorite_groups(app_user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_groups_idol_group_id ON user_favorite_groups(idol_group_id);
CREATE INDEX IF NOT EXISTS idx_daily_score_histories_app_user_id ON daily_score_histories(app_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_score_histories_date ON daily_score_histories(date);

-- Create updated_at trigger for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE user_favorite_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_score_histories ENABLE ROW LEVEL SECURITY;

-- Users can see all favorite groups (for ranking/social features)
CREATE POLICY "user_favorite_groups_select_policy" ON user_favorite_groups
    FOR SELECT TO authenticated, anon
    USING (true);

-- Users can only insert/update/delete their own favorite groups
CREATE POLICY "user_favorite_groups_insert_policy" ON user_favorite_groups
    FOR INSERT TO authenticated
    WITH CHECK (app_user_id IN (
        SELECT app_user_id FROM app_users WHERE supabase_uuid = auth.uid()
    ));

CREATE POLICY "user_favorite_groups_update_policy" ON user_favorite_groups
    FOR UPDATE TO authenticated
    USING (app_user_id IN (
        SELECT app_user_id FROM app_users WHERE supabase_uuid = auth.uid()
    ));

CREATE POLICY "user_favorite_groups_delete_policy" ON user_favorite_groups
    FOR DELETE TO authenticated
    USING (app_user_id IN (
        SELECT app_user_id FROM app_users WHERE supabase_uuid = auth.uid()
    ));

-- Users can see all daily score histories (for ranking/social features)
CREATE POLICY "daily_score_histories_select_policy" ON daily_score_histories
    FOR SELECT TO authenticated, anon
    USING (true);

-- Users can insert/update their own daily score histories
CREATE POLICY "daily_score_histories_insert_policy" ON daily_score_histories
    FOR INSERT TO authenticated
    WITH CHECK (app_user_id IN (
        SELECT app_user_id FROM app_users WHERE supabase_uuid = auth.uid()
    ));

CREATE POLICY "daily_score_histories_update_policy" ON daily_score_histories
    FOR UPDATE TO authenticated
    USING (app_user_id IN (
        SELECT app_user_id FROM app_users WHERE supabase_uuid = auth.uid()
    ));
