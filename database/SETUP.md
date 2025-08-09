# Database Setup Guide

## Quick Start with Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a strong database password (save it!)
4. Select a region close to your users
5. Wait for project to initialize (~2 minutes)

### 2. Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy contents of `schema.sql`
4. Run the query
5. You should see "Success. No rows returned"

### 3. Seed Initial Data

1. Still in SQL Editor, create another query
2. Copy contents of `seed.sql`
3. Run the query
4. You should see assignments, missions, and teams created

### 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://YOUR_PROJECT.supabase.co`
   - **Anon/Public Key**: (safe for browser)
   - **Service Role Key**: (keep secret, server-only)

### 5. Configure Your App

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Or for static site, update `lib/supabase.js`:
```javascript
async loadConfig() {
    return {
        supabaseUrl: 'your_project_url',
        supabaseAnonKey: 'your_anon_key'
    };
}
```

### 6. Enable Authentication

In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Anonymous Sign-ins** (for quick start)
3. Optionally enable Email, Google, GitHub, etc.

## Database Structure

### Core Tables

- **agents** - Users of the platform
- **assignments** - Individual tasks
- **missions** - Collections of assignments
- **teams** - Groups of agents
- **assignment_progress** - Tracking who's doing what
- **mission_progress** - Progress on missions
- **operations** - Special time-limited events
- **verifications** - Community verification system

### Key Features

- **UUID primary keys** for all tables
- **Row Level Security (RLS)** for data protection
- **Automatic timestamps** with triggers
- **Full-text search** ready
- **Optimized indexes** for common queries

## API Examples

### Get Random Assignment
```javascript
const { data } = await supabase
  .rpc('get_random_assignment', {
    p_duration_type: 'quick',
    p_location_type: 'local'
  });
```

### Accept Assignment
```javascript
const { data } = await supabase
  .from('assignment_progress')
  .insert({
    assignment_id: 'uuid-here',
    status: 'accepted'
  });
```

### Get Leaderboard
```javascript
const { data } = await supabase
  .from('agents')
  .select('username, points, rank')
  .order('points', { ascending: false })
  .limit(10);
```

## Security Notes

1. **Never expose Service Role Key** in client code
2. **Use Row Level Security** - already configured
3. **Anonymous users** get temporary IDs
4. **Rate limiting** is automatic on Supabase

## Migrations

To update schema later:
1. Create new SQL file in `database/migrations/`
2. Run in SQL Editor
3. Test thoroughly
4. Document changes

## Backup

Supabase automatically backs up your database daily.
For manual backup:
1. Go to **Settings** → **Database**
2. Click **Backups**
3. Download backup

## Monitoring

Check database health:
1. **Database** → View table sizes
2. **Reports** → Database metrics
3. **Logs** → Query performance

## Troubleshooting

### Connection Issues
- Check API keys are correct
- Verify RLS policies aren't blocking
- Check browser console for CORS errors

### Performance Issues
- Check indexes are being used
- Consider pagination for large datasets
- Use database functions for complex queries

### Migration Issues
- Always test on a development database first
- Keep migrations small and focused
- Document breaking changes

## Local Development

For local Supabase:
```bash
npm install -g supabase
supabase init
supabase start
```

This gives you a local Postgres database for development.