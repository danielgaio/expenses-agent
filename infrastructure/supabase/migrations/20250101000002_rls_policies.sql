-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Households policies
CREATE POLICY "Users can view households they belong to"
    ON public.households FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = households.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners can update households"
    ON public.households FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = households.id 
            AND user_id = auth.uid() 
            AND role = 'owner'
        )
    );

-- Household members policies
CREATE POLICY "Users can view members of their households"
    ON public.household_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members hm
            WHERE hm.household_id = household_members.household_id 
            AND hm.user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners can manage members"
    ON public.household_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = household_members.household_id 
            AND user_id = auth.uid() 
            AND role = 'owner'
        )
    );

-- Categories policies
CREATE POLICY "Users can view categories in their households"
    ON public.categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = categories.household_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Adults can manage categories"
    ON public.categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = categories.household_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'adult')
        )
    );

-- Transactions policies
CREATE POLICY "Users can view transactions in their households"
    ON public.transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members hm
            WHERE hm.household_id = transactions.household_id 
            AND hm.user_id = auth.uid()
            AND (
                -- Adults and owners see all
                hm.role IN ('owner', 'adult', 'viewer')
                -- Children only see their own
                OR (hm.role = 'child' AND transactions.user_id = auth.uid())
            )
        )
    );

CREATE POLICY "Users can create transactions in their households"
    ON public.transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = transactions.household_id 
            AND user_id = auth.uid()
            AND role IN ('owner', 'adult', 'child')
        )
    );

CREATE POLICY "Users can update their own transactions or if they're adults"
    ON public.transactions FOR UPDATE
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = transactions.household_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'adult')
        )
    );

CREATE POLICY "Users can delete their own transactions or if they're adults"
    ON public.transactions FOR DELETE
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = transactions.household_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'adult')
        )
    );

-- Artifacts policies
CREATE POLICY "Users can view artifacts in their households"
    ON public.artifacts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = artifacts.household_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create artifacts in their households"
    ON public.artifacts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = artifacts.household_id AND user_id = auth.uid()
        )
    );

-- Installments policies (inherit from transactions)
CREATE POLICY "Users can view installments for transactions they can see"
    ON public.installment_schedules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.transactions t
            JOIN public.household_members hm ON hm.household_id = t.household_id
            WHERE t.id = installment_schedules.transaction_id 
            AND hm.user_id = auth.uid()
        )
    );

-- Recurring rules policies (inherit from transactions)
CREATE POLICY "Users can view recurring rules for transactions they can see"
    ON public.recurring_rules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.transactions t
            JOIN public.household_members hm ON hm.household_id = t.household_id
            WHERE t.id = recurring_rules.transaction_id 
            AND hm.user_id = auth.uid()
        )
    );

-- Budgets policies
CREATE POLICY "Users can view budgets in their households"
    ON public.budgets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = budgets.household_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Only adults can manage budgets"
    ON public.budgets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = budgets.household_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'adult')
        )
    );
