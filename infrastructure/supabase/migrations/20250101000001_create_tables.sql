-- Create users profile table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    locale TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    notification_settings JSONB DEFAULT '{
        "email": true,
        "push": true,
        "budgetAlerts": true,
        "transactionReminders": true
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create households table
CREATE TABLE public.households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create household members table
CREATE TABLE public.household_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(household_id, user_id)
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type transaction_type NOT NULL,
    icon TEXT,
    color TEXT,
    parent_id UUID REFERENCES public.categories(id),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    exchange_rate DECIMAL(15, 6),
    status transaction_status NOT NULL DEFAULT 'realized',
    date TIMESTAMPTZ NOT NULL,
    merchant TEXT,
    payee TEXT,
    method TEXT,
    notes TEXT,
    category_id UUID REFERENCES public.categories(id),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    source_artifact_id UUID,
    ai_confidence DECIMAL(3, 2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
    provenance provenance_type NOT NULL DEFAULT 'user',
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create artifacts table (for OCR/STT assets)
CREATE TABLE public.artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video', 'text')),
    storage_path TEXT NOT NULL,
    transcription TEXT,
    parsed_data JSONB,
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create installment schedules table
CREATE TABLE public.installment_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    total_installments INTEGER NOT NULL CHECK (total_installments > 0),
    current_installment INTEGER NOT NULL CHECK (current_installment > 0),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    interest_rate DECIMAL(5, 2) DEFAULT 0,
    due_date TIMESTAMPTZ NOT NULL,
    status transaction_status NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recurring rules table
CREATE TABLE public.recurring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    frequency frequency_type NOT NULL,
    interval INTEGER DEFAULT 1 CHECK (interval > 0),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id),
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    period frequency_type NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_transactions_household_id ON public.transactions(household_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_household_members_user_id ON public.household_members(user_id);
CREATE INDEX idx_household_members_household_id ON public.household_members(household_id);
CREATE INDEX idx_categories_household_id ON public.categories(household_id);
CREATE INDEX idx_installments_transaction_id ON public.installment_schedules(transaction_id);
CREATE INDEX idx_recurring_transaction_id ON public.recurring_rules(transaction_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON public.installment_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_updated_at BEFORE UPDATE ON public.recurring_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
