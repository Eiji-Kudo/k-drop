import { supabase } from '@/utils/supabase'

export class UserScoreRepository {
  async updateTotalScore(userId: number, scoreToAdd: number): Promise<void> {
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_profile_id, total_otaku_score, total_otaku_layer_id')
      .eq('app_user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error(`Failed to fetch user profile: ${profileError?.message}`)
    }

    const newScore = profile.total_otaku_score + scoreToAdd

    const { data: layers, error: layersError } = await supabase
      .from('total_otaku_layers')
      .select('*')
      .lte('min_score', newScore)
      .gte('max_score', newScore)
      .single()

    if (layersError || !layers) {
      console.warn('Failed to find appropriate layer for score:', newScore)
    }

    const newLayerId =
      layers?.total_otaku_layer_id || profile.total_otaku_layer_id

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        total_otaku_score: newScore,
        total_otaku_layer_id: newLayerId,
      })
      .eq('user_profile_id', profile.user_profile_id)

    if (updateError) {
      throw new Error(`Failed to update user profile: ${updateError.message}`)
    }
  }

  async updateGroupScore(
    userId: number,
    groupId: number,
    scoreToAdd: number,
  ): Promise<void> {
    const { data: existingScore, error: fetchError } = await supabase
      .from('user_idol_group_scores')
      .select('*')
      .eq('app_user_id', userId)
      .eq('idol_group_id', groupId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch group score: ${fetchError.message}`)
    }

    if (!existingScore) {
      const { data: defaultLayer } = await supabase
        .from('group_otaku_layers')
        .select('group_otaku_layer_id')
        .lte('min_score', scoreToAdd)
        .gte('max_score', scoreToAdd)
        .single()

      const { error: insertError } = await supabase
        .from('user_idol_group_scores')
        .insert({
          app_user_id: userId,
          idol_group_id: groupId,
          otaku_score: scoreToAdd,
          group_otaku_layer_id: defaultLayer?.group_otaku_layer_id || 1,
        })

      if (insertError) {
        throw new Error(`Failed to create group score: ${insertError.message}`)
      }
      return
    }

    const newScore = existingScore.otaku_score + scoreToAdd

    const { data: layers, error: layersError } = await supabase
      .from('group_otaku_layers')
      .select('*')
      .lte('min_score', newScore)
      .gte('max_score', newScore)
      .single()

    if (layersError || !layers) {
      console.warn(
        'Failed to find appropriate layer for group score:',
        newScore,
      )
    }

    const newLayerId =
      layers?.group_otaku_layer_id || existingScore.group_otaku_layer_id

    const { error: updateError } = await supabase
      .from('user_idol_group_scores')
      .update({
        otaku_score: newScore,
        group_otaku_layer_id: newLayerId,
      })
      .eq('user_idol_group_score_id', existingScore.user_idol_group_score_id)

    if (updateError) {
      throw new Error(`Failed to update group score: ${updateError.message}`)
    }
  }
}
