# Lucky International Schools Secondary School - Setup Guide

## Overview

This is a comprehensive secondary school management system built with Next.js 16 and Supabase. It includes a public website, student dashboard, and full admin panel for managing school operations.

## Features

### Public Website

- **Home Page**: Hero section with school highlights and statistics
- **About Page**: School history, mission, vision, and values
- **Academics Page**: Academic programs and facilities
- **Staff Directory**: Complete faculty and staff listing
- **Contact Page**: Contact form and school information

### Student Dashboard

- **Profile Management**: View personal and academic information
- **Results Viewing**: View academic results by term and year
- **Class Information**: Weekly schedule and enrolled subjects
- **Settings**: Notification and privacy preferences

### Admin Panel

- **Dashboard**: System overview with key statistics
- **Student Management**: Add, edit, and manage student records
- **Staff Management**: Manage staff profiles and information
- **Results Management**: Upload and manage student grades
- **Subject Management**: Manage school subjects
- **System Settings**: Configure school information and preferences

## Prerequisites

Before getting started, ensure you have:

1. **Supabase Account**: Create a free account at https://supabase.com
2. **Node.js**: Version 18 or higher
3. **Git**: For version control
4. **Environment Variables**: Supabase credentials

## Installation Steps

### 1. Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database Schema Setup

The database requires the following tables. Use the Supabase SQL editor to execute:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  user_type TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL UNIQUE,
  class TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create results table
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  score NUMERIC(5, 2) NOT NULL,
  grade TEXT,
  term TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Default User Types

The system uses the following user types:

- **student**: Can access student dashboard and view their results
- **admin**: Can access admin panel and manage the system
- **staff**: (Reserved for future staff management)

## User Registration

To create users:

1. **Students**: Sign up through `/auth/sign-up` with metadata `user_type: "student"`
2. **Admin**: Create manually in Supabase with metadata `user_type: "admin"`

## Project Structure

```
app/
├── page.tsx                 # Home page
├── about/                   # About page
├── academics/               # Academics page
├── staff/                   # Staff directory
├── contact/                 # Contact page
├── auth/                    # Authentication pages
│   ├── callback/           # Auth callback handler
│   ├── login/              # Login page
│   └── sign-up/            # Sign-up page
├── dashboard/              # Student dashboard
│   ├── results/            # Student results
│   ├── profile/            # Student profile
│   ├── classes/            # Class information
│   └── settings/           # Student settings
└── admin/                  # Admin panel
    ├── students/           # Manage students
    ├── staff/              # Manage staff
    ├── results/            # Upload results
    ├── subjects/           # Manage subjects
    └── settings/           # System settings

components/
├── navbar.tsx              # Main navigation bar
├── dashboard-sidebar.tsx   # Student dashboard sidebar
├── admin-sidebar.tsx       # Admin panel sidebar
└── ui/                     # shadcn/ui components

lib/
└── supabase/
    ├── client.ts           # Browser client
    ├── server.ts           # Server client
    └── proxy.ts            # Proxy configuration
```

## Customization

### School Information

Update school details in:

- `app/page.tsx` - School name and mission
- `app/about/page.tsx` - History and values
- `app/contact/page.tsx` - Contact details
- `app/globals.css` - Brand colors

### Color Scheme

The app uses a navy blue + teal color scheme. To customize:

1. Edit design tokens in `app/globals.css`
2. Update CSS variables for primary, secondary, and accent colors

### Database RLS Policies

Add additional Row Level Security policies in the Supabase SQL editor as needed for your specific requirements.

## Features & Capabilities

### For Students

- View personal dashboard with academic overview
- Access complete result history organized by term
- View class schedule and enrolled subjects
- Update notification preferences
- Download or print results

### For Admins

- View system statistics and analytics
- Add and manage student records
- Manage staff information
- Upload and manage student results (batch or individual)
- Configure system settings
- Generate reports and analytics

## Security Features

- **Row Level Security (RLS)**: All tables protected with RLS policies
- **Email Verification**: Users must verify emails before accessing data
- **Admin Access Control**: Admin panel restricted to admin users only
- **Secure Authentication**: Supabase Auth with JWT tokens
- **HTTPS Support**: Ready for production deployment

## Deployment

### To Deploy on Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Production Checklist

- [ ] Configure RLS policies properly
- [ ] Set up email domain verification
- [ ] Update school contact information
- [ ] Test student signup and login flow
- [ ] Test admin panel access
- [ ] Configure backup strategy
- [ ] Set up error monitoring
- [ ] Enable HTTPS

## Troubleshooting

### Login Issues

- Ensure email is verified in Supabase
- Check environment variables are correctly set
- Verify RLS policies allow user access

### Results Not Showing

- Confirm student record exists in `students` table
- Verify results are linked to correct `student_id`
- Check term and year filters

### Admin Panel Access Denied

- Verify user has `user_type = 'admin'` in profiles table
- Check admin middleware in `app/admin/layout.tsx`

## Support & Maintenance

- **Database Backups**: Configure automatic backups in Supabase
- **Monitoring**: Use Supabase Analytics for insights
- **Updates**: Keep Next.js and dependencies updated
- **Security**: Review and update RLS policies regularly

## Future Enhancements

- [ ] Student fee management system
- [ ] Parent/Guardian portal
- [ ] Attendance tracking
- [ ] Library management
- [ ] Sports management
- [ ] Report card generation
- [ ] Mobile app
- [ ] Advanced analytics dashboard

## Support

For issues, questions, or feature requests, contact the development team or visit the project repository.

---

**Last Updated**: 2024
**Version**: 1.0.0
