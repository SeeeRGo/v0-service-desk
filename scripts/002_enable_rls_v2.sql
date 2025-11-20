-- Enable Row Level Security on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;

-- Fixed users policies to avoid infinite recursion
-- Users policies - FIXED to avoid recursion
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Allow insert for authenticated users"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Simplified companies policies
-- Companies policies
CREATE POLICY "Users can view all companies"
  ON public.companies FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow insert companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Service categories policies (public read)
CREATE POLICY "Anyone can view service categories"
  ON public.service_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow manage service categories"
  ON public.service_categories FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Simplified tickets policies
-- Tickets policies
CREATE POLICY "Users can view tickets"
  ON public.tickets FOR SELECT
  USING (
    client_id = auth.uid()
    OR assigned_to = auth.uid()
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update tickets"
  ON public.tickets FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete tickets"
  ON public.tickets FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Ticket comments policies
CREATE POLICY "Users can view comments"
  ON public.ticket_comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can add comments"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their comments"
  ON public.ticket_comments FOR UPDATE
  USING (user_id = auth.uid());

-- Ticket history policies
CREATE POLICY "Users can view history"
  ON public.ticket_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert history"
  ON public.ticket_history FOR INSERT
  WITH CHECK (true);

-- SLA definitions policies
CREATE POLICY "Everyone can view SLA definitions"
  ON public.sla_definitions FOR SELECT
  USING (true);

CREATE POLICY "Allow manage SLA definitions"
  ON public.sla_definitions FOR ALL
  USING (auth.uid() IS NOT NULL);

-- KB articles policies
CREATE POLICY "Everyone can view KB articles"
  ON public.kb_articles FOR SELECT
  USING (true);

CREATE POLICY "Users can create KB articles"
  ON public.kb_articles FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their KB articles"
  ON public.kb_articles FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their KB articles"
  ON public.kb_articles FOR DELETE
  USING (author_id = auth.uid());
