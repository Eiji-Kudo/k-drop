export const mockUserProfiles = [
  {
    app_user_id: 9001,
    user_name: 'TestUser1',
    display_name: 'Test User 1',
    total_otaku_score: 1000, // 700 (group1) + 300 (group2) = 1000
    total_otaku_layers: {},
  },
  {
    app_user_id: 9002,
    user_name: 'TestUser2',
    display_name: 'Test User 2',
    total_otaku_score: 800, // 200 (group1) + 600 (group2) = 800
    total_otaku_layers: {},
  },
  {
    app_user_id: 9003,
    user_name: 'TestUser3',
    display_name: 'Test User 3',
    total_otaku_score: 600, // 500 (group1) + 100 (group3) = 600
    total_otaku_layers: {},
  },
]

export const mockUserIdolGroupScores = [
  {
    app_user_id: 9001,
    idol_group_id: 9001,
    otaku_score: 700,
    idol_groups: { idol_group_id: 9001, idol_group_name: 'Test Group 1' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 1' }] },
  },
  {
    app_user_id: 9002,
    idol_group_id: 9001,
    otaku_score: 200,
    idol_groups: { idol_group_id: 9001, idol_group_name: 'Test Group 1' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 2' }] },
  },
  {
    app_user_id: 9003,
    idol_group_id: 9001,
    otaku_score: 500,
    idol_groups: { idol_group_id: 9001, idol_group_name: 'Test Group 1' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 3' }] },
  },
  {
    app_user_id: 9001,
    idol_group_id: 9002,
    otaku_score: 300,
    idol_groups: { idol_group_id: 9002, idol_group_name: 'Test Group 2' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 1' }] },
  },
  {
    app_user_id: 9002,
    idol_group_id: 9002,
    otaku_score: 600,
    idol_groups: { idol_group_id: 9002, idol_group_name: 'Test Group 2' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 2' }] },
  },
  {
    app_user_id: 9003,
    idol_group_id: 9003,
    otaku_score: 100,
    idol_groups: { idol_group_id: 9003, idol_group_name: 'Test Group 3' },
    group_otaku_layers: {},
    app_users: { user_profiles: [{ display_name: 'Test User 3' }] },
  },
]

export const mockIdolGroups = [
  { idol_group_id: 9001, idol_group_name: 'Test Group 1' },
  { idol_group_id: 9002, idol_group_name: 'Test Group 2' },
  { idol_group_id: 9003, idol_group_name: 'Test Group 3' },
]
