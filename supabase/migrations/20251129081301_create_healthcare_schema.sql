/*
  # Healthcare Wellness Portal Schema

  1. New Tables
    - `user_profiles` - Extended profile information for patients
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `phone` (text)
      - `address` (text)
      - `emergency_contact` (text)
      - `blood_type` (text)
      - `allergies` (text)
      - `medical_conditions` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_roles` - User role management (patient/provider)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text) - 'patient' or 'provider'
      - `created_at` (timestamptz)
    
    - `health_goals` - Patient health goals and tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `target_value` (numeric)
      - `current_value` (numeric)
      - `unit` (text)
      - `target_date` (date)
      - `status` (text) - 'active', 'completed', 'abandoned'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `goal_progress` - Track progress updates for goals
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references health_goals)
      - `value` (numeric)
      - `notes` (text)
      - `recorded_at` (timestamptz)
    
    - `health_articles` - Public health information articles
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `summary` (text)
      - `content` (text)
      - `author` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to manage their own data
    - Public read access for health articles
    - Users can only see their own profiles and goals
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  date_of_birth date,
  phone text DEFAULT '',
  address text DEFAULT '',
  emergency_contact text DEFAULT '',
  blood_type text DEFAULT '',
  allergies text DEFAULT '',
  medical_conditions text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('patient', 'provider')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  target_value numeric,
  current_value numeric DEFAULT 0,
  unit text DEFAULT '',
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON health_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON health_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON health_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON health_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Goal Progress Table
CREATE TABLE IF NOT EXISTS goal_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES health_goals(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  notes text DEFAULT '',
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goal progress"
  ON goal_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM health_goals
      WHERE health_goals.id = goal_progress.goal_id
      AND health_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own goal progress"
  ON goal_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM health_goals
      WHERE health_goals.id = goal_progress.goal_id
      AND health_goals.user_id = auth.uid()
    )
  );

-- Health Articles Table
CREATE TABLE IF NOT EXISTS health_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  summary text NOT NULL,
  content text NOT NULL,
  author text DEFAULT 'HCLTech Health Team',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read health articles"
  ON health_articles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample health articles
INSERT INTO health_articles (title, category, summary, content) VALUES
  (
    'Understanding Preventive Care',
    'Preventive Care',
    'Learn about the importance of preventive healthcare and regular checkups.',
    'Preventive care is essential for maintaining good health and catching potential health issues early. Regular checkups, screenings, and vaccinations can help prevent serious health problems. Schedule annual physicals, dental checkups, and age-appropriate screenings to stay on top of your health.'
  ),
  (
    'Mental Health Awareness',
    'Mental Health',
    'Explore resources and support options for maintaining good mental health.',
    'Mental health is just as important as physical health. Common signs of mental health concerns include persistent sadness, anxiety, changes in sleep or appetite, and difficulty concentrating. If you''re experiencing these symptoms, reach out to a healthcare provider. Remember, seeking help is a sign of strength.'
  ),
  (
    'Nutrition and Wellness',
    'Nutrition',
    'Discover how proper nutrition contributes to overall wellness and disease prevention.',
    'A balanced diet rich in fruits, vegetables, whole grains, and lean proteins supports overall health. Aim for variety in your meals, stay hydrated, and limit processed foods and added sugars. Consider consulting with a nutritionist to develop a personalized eating plan that meets your health goals.'
  ),
  (
    'Exercise and Physical Activity',
    'Fitness',
    'Learn about the benefits of regular physical activity for your health.',
    'Regular exercise helps maintain a healthy weight, reduces risk of chronic diseases, and improves mental health. Aim for at least 150 minutes of moderate aerobic activity per week, plus strength training twice weekly. Find activities you enjoy to make exercise a sustainable part of your routine.'
  ),
  (
    'Managing Chronic Conditions',
    'Chronic Care',
    'Tips for effectively managing chronic health conditions.',
    'Living with a chronic condition requires ongoing care and self-management. Take medications as prescribed, attend regular appointments, monitor your symptoms, and maintain healthy lifestyle habits. Work closely with your healthcare team to develop a comprehensive management plan tailored to your needs.'
  )
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_id ON goal_progress(goal_id);
CREATE INDEX IF NOT EXISTS idx_health_articles_category ON health_articles(category);
