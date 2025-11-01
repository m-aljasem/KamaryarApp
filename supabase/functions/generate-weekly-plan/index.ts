import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, assessmentData } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Get content libraries
    const [exercisesResult, meditationsResult, educationResult] = await Promise.all([
      supabaseClient.from('content_exercises').select('*'),
      supabaseClient.from('content_meditations').select('*'),
      supabaseClient.from('content_education').select('*')
    ]);

    const exercises = exercisesResult.data || [];
    const meditations = meditationsResult.data || [];
    const educations = educationResult.data || [];

    // Calculate plan parameters based on assessment
    const startBackScore = assessmentData?.startBack?.result?.totalScore || 0;
    const isHighRisk = startBackScore >= 4;
    const psychosocialScore = assessmentData?.startBack?.result?.psychosocialScore || 0;
    const isHighPsychosocial = psychosocialScore >= 4;

    // Generate weekly plan
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)

    // Create weekly plan
    const { data: plan, error: planError } = await supabaseClient
      .from('weekly_plans')
      .insert({
        user_id: userId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      })
      .select()
      .single();

    if (planError) throw planError;

    // Generate daily activities
    const activities = [];

    for (let day = 0; day < 7; day++) {
      const dayActivities: any[] = [];

      // Add exercises (2-3 per day based on risk level)
      const exerciseCount = isHighRisk ? 3 : 2;
      const selectedExercises = exercises
        .sort(() => Math.random() - 0.5)
        .slice(0, exerciseCount);
      
      selectedExercises.forEach(exercise => {
        dayActivities.push({
          plan_id: plan.id,
          day_of_week: day,
          content_type: 'exercise',
          content_id: exercise.id,
          status: 'pending'
        });
      });

      // Add meditation (more for high psychosocial risk)
      if (isHighPsychosocial || day % 2 === 0) {
        const meditation = meditations[Math.floor(Math.random() * meditations.length)];
        if (meditation) {
          dayActivities.push({
            plan_id: plan.id,
            day_of_week: day,
            content_type: 'meditation',
            content_id: meditation.id,
            status: 'pending'
          });
        }
      }

      // Add education tip (2-3 per week)
      if (day % 3 === 0 || isHighRisk) {
        const education = educations[Math.floor(Math.random() * educations.length)];
        if (education) {
          dayActivities.push({
            plan_id: plan.id,
            day_of_week: day,
            content_type: 'education',
            content_id: education.id,
            status: 'pending'
          });
        }
      }

      activities.push(...dayActivities);
    }

    // Insert all activities
    if (activities.length > 0) {
      const { error: activitiesError } = await supabaseClient
        .from('daily_activities')
        .insert(activities);

      if (activitiesError) throw activitiesError;
    }

    return new Response(
      JSON.stringify({ success: true, plan }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

