# Kamaryar Mobile App

Evidence-based self-management program for non-specific low back pain.

## Overview

Kamaryar is a mobile application built with Ionic and Angular that provides a comprehensive, personalized program for managing low back pain. The app includes:

- Multi-language support (English, Persian, Arabic) with RTL support
- User authentication via Supabase
- Comprehensive assessment tools (Red Flag Screening, STarT Back, RMDQ, VAS)
- Personalized weekly plans based on user assessments
- Daily pain logging and progress tracking
- Exercise, meditation, and educational content

## Tech Stack

- **Frontend:** Ionic 7 with Angular 17
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Languages:** TypeScript, SQL/PLpgSQL
- **i18n:** ngx-translate

## Prerequisites

- Node.js 18+ and npm
- Ionic CLI: `npm install -g @ionic/cli`
- Supabase account and project
- Capacitor CLI (for mobile builds): `npm install -g @capacitor/cli`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema in `supabase/schema.sql` in your Supabase SQL Editor
3. Deploy the Edge Function in `supabase/functions/generate-weekly-plan/`:
   ```bash
   supabase functions deploy generate-weekly-plan
   ```
4. Copy your Supabase URL and anon key
5. Update `src/environments/environment.ts` and `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: false,
     supabaseUrl: 'YOUR_SUPABASE_URL',
     supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```

### 3. Configure Google OAuth (Optional)

1. In Supabase Dashboard → Authentication → Providers, enable Google
2. Add your OAuth credentials
3. Configure redirect URLs

### 4. Seed Content (Optional)

Add sample exercises, meditations, and education content to your database:

```sql
-- Example: Insert an exercise
INSERT INTO content_exercises (name, description, video_url, category, sets, reps)
VALUES (
  '{"en": "Bird-Dog Exercise", "fa": "ورزش پرنده-سگ", "ar": "تمرين الطائر-الكلب"}',
  '{"en": "A core stability exercise...", "fa": "...", "ar": "..."}',
  'https://example.com/videos/bird-dog.mp4',
  'Motor Control',
  2,
  8
);
```

### 5. Run the Application

```bash
# Development server
ionic serve

# Or with Angular CLI
ng serve
```

### 6. Build for Mobile

```bash
# Add platforms
ionic build
npx cap add android
npx cap add ios

# Sync and open
npx cap sync
npx cap open android  # or ios
```

## Project Structure

```
kamaryar/
├── src/
│   ├── app/
│   │   ├── models/          # TypeScript models/interfaces
│   │   ├── services/         # Services (Auth, Supabase, etc.)
│   │   ├── guards/           # Route guards
│   │   ├── pages/            # Page components
│   │   ├── app.module.ts     # Root module
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   └── i18n/            # Translation files
│   ├── theme/               # SCSS theme files
│   └── environments/        # Environment configs
├── supabase/
│   ├── schema.sql           # Database schema
│   └── functions/           # Edge Functions
└── package.json
```

## Features

### Phase 1: Onboarding
- Language selection (first screen)
- User registration/login (email + Google OAuth)
- Profile setup (age, name, job type, activity level)

### Phase 2: Initial Assessment
- Red Flag Screening (IFOMPT guidelines)
- Pain Localization (interactive body chart)
- STarT Back Screening Tool (9 questions)
- Roland-Morris Disability Questionnaire (24 questions)
- Visual Analog Scale (VAS) for pain intensity

### Phase 3: Weekly Plan
- Personalized plan generation based on assessment
- Daily activities (exercises, meditations, education)
- Activity completion tracking
- Content library with videos, audio, and text
- More soon !

### Phase 4: Progress Tracking
- Daily pain logging with VAS
- Progress graphs (VAS scores over time)
- RMDQ score tracking (every 2 weeks)
- Adherence statistics

## UI/UX

The app features a modern UI with:
- Rounded corners (16-24px border radius)
- Color scheme: Blue (#2196F3), Green (#4CAF50), White
- Full RTL support for Persian and Arabic
- Responsive design for mobile devices
- Smooth animations and transitions

## Development

### Adding Translations

1. Update translation files in `src/assets/i18n/`
2. Use `{{ 'KEY' | translate }}` in templates
3. Use `this.translate.instant('KEY')` in TypeScript

### Adding Content

Content is stored in Supabase tables:
- `content_exercises` - Exercise library
- `content_meditations` - Meditation library
- `content_education` - Educational tips

Each content item supports i18n via JSONB fields.

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check Supabase URL and keys in environment files
2. **RLS policy errors**: Ensure policies are created in Supabase
3. **Edge Function errors**: Check function logs in Supabase Dashboard
4. **i18n not working**: Ensure translation files are in `src/assets/i18n/`

## License

MIT

## Contact

mohamad@aljasem.eu.org

