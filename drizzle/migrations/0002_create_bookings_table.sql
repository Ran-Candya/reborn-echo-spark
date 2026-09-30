CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  invitee_name text,
  invitee_email text,
  invitee_uri text,
  event_uri text,
  status text,
  start_time timestamptz,
  end_time timestamptz,
  cancel_url text,
  reschedule_url text,
  timezone text,
  questions_answers jsonb,
  raw_payload jsonb NOT NULL
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;