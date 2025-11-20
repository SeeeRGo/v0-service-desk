-- Drop existing policies for tickets table
DROP POLICY IF EXISTS "Clients can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Clients can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Engineers can update assigned tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins and supervisors can manage all tickets" ON public.tickets;

-- Create helper function to get user role without recursion
CREATE OR REPLACE FUNCTION get_ticket_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::TEXT,
    'client'
  );
$$;

-- Tickets policies (fixed to avoid recursion)
CREATE POLICY "Users can view tickets based on role"
  ON public.tickets FOR SELECT
  USING (
    -- Clients see only their tickets
    (get_ticket_user_role() = 'client' AND client_id = auth.uid())
    OR
    -- Engineers see assigned tickets
    (get_ticket_user_role() = 'engineer' AND assigned_to = auth.uid())
    OR
    -- Supervisors and admins see all tickets
    (get_ticket_user_role() IN ('supervisor', 'admin'))
  );

CREATE POLICY "Authenticated users can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND client_id = auth.uid()
  );

CREATE POLICY "Engineers can update assigned tickets"
  ON public.tickets FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR get_ticket_user_role() IN ('supervisor', 'admin')
  );

CREATE POLICY "Supervisors and admins can delete tickets"
  ON public.tickets FOR DELETE
  USING (get_ticket_user_role() IN ('supervisor', 'admin'));

-- Grant execute permission on helper function
GRANT EXECUTE ON FUNCTION get_ticket_user_role() TO authenticated;
