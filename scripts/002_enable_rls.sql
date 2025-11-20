-- Enable Row Level Security on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company"
  ON public.companies FOR SELECT
  USING (
    id IN (SELECT company_id FROM public.users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Admins can manage companies"
  ON public.companies FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'engineer')));

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can manage all users"
  ON public.users FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Service categories policies (public read)
CREATE POLICY "Anyone can view service categories"
  ON public.service_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage service categories"
  ON public.service_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Tickets policies
CREATE POLICY "Clients can view their own tickets"
  ON public.tickets FOR SELECT
  USING (
    client_id = auth.uid()
    OR assigned_to = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'engineer'))
  );

CREATE POLICY "Clients can create tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Engineers can update assigned tickets"
  ON public.tickets FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Admins and supervisors can manage all tickets"
  ON public.tickets FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

-- Ticket comments policies
CREATE POLICY "Users can view comments on their tickets"
  ON public.ticket_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id
      AND (
        client_id = auth.uid()
        OR assigned_to = auth.uid()
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'engineer'))
      )
    )
  );

CREATE POLICY "Users can add comments to accessible tickets"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id
      AND (
        client_id = auth.uid()
        OR assigned_to = auth.uid()
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'engineer'))
      )
    )
  );

-- Ticket history policies
CREATE POLICY "Users can view history of their tickets"
  ON public.ticket_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id
      AND (
        client_id = auth.uid()
        OR assigned_to = auth.uid()
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'engineer'))
      )
    )
  );

CREATE POLICY "System can insert history"
  ON public.ticket_history FOR INSERT
  WITH CHECK (true);

-- SLA definitions policies
CREATE POLICY "Everyone can view SLA definitions"
  ON public.sla_definitions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage SLA definitions"
  ON public.sla_definitions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- KB articles policies
CREATE POLICY "Everyone can view KB articles"
  ON public.kb_articles FOR SELECT
  USING (true);

CREATE POLICY "Engineers can create KB articles"
  ON public.kb_articles FOR INSERT
  WITH CHECK (author_id = auth.uid() AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('engineer', 'supervisor', 'admin')));

CREATE POLICY "Authors and admins can update KB articles"
  ON public.kb_articles FOR UPDATE
  USING (author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
