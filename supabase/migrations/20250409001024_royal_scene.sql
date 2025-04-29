/*
  # Initial Schema Setup for College Clubs Platform

  1. New Tables
    - `profiles`
      - User profiles with additional information
    - `clubs`
      - Club information and details
    - `club_members`
      - Mapping between users and clubs they belong to
    - `events`
      - Club events with details and calendar integration
    - `event_registrations`
      - Track event registrations by users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  university text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  university text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create club_members table
CREATE TABLE IF NOT EXISTS club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  google_calendar_event_id text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Clubs policies
CREATE POLICY "Anyone can view clubs"
  ON clubs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Club admins can update clubs"
  ON clubs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_members
      WHERE club_id = clubs.id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Club members policies
CREATE POLICY "Users can view club members"
  ON club_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Club admins can manage members"
  ON club_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_members cm
      WHERE cm.club_id = club_members.club_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
    )
  );

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Club members can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM club_members
      WHERE club_id = events.club_id
      AND user_id = auth.uid()
    )
  );

-- Event registrations policies
CREATE POLICY "Users can view their registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());