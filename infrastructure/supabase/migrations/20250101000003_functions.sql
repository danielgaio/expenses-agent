-- Insert default categories for new households
CREATE OR REPLACE FUNCTION create_default_categories(household_id_param UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.categories (household_id, name, type, is_default) VALUES
        -- Expense categories
        (household_id_param, 'Food & Dining', 'expense', true),
        (household_id_param, 'Transportation', 'expense', true),
        (household_id_param, 'Housing', 'expense', true),
        (household_id_param, 'Utilities', 'expense', true),
        (household_id_param, 'Healthcare', 'expense', true),
        (household_id_param, 'Entertainment', 'expense', true),
        (household_id_param, 'Shopping', 'expense', true),
        (household_id_param, 'Education', 'expense', true),
        -- Income categories
        (household_id_param, 'Salary', 'income', true),
        (household_id_param, 'Freelance', 'income', true),
        (household_id_param, 'Investments', 'income', true),
        (household_id_param, 'Other Income', 'income', true),
        -- Investment categories
        (household_id_param, 'Stocks', 'investment', true),
        (household_id_param, 'Bonds', 'investment', true),
        (household_id_param, 'Real Estate', 'investment', true),
        (household_id_param, 'Retirement', 'investment', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate household analytics
CREATE OR REPLACE FUNCTION get_household_analytics(
    household_id_param UUID,
    start_date_param TIMESTAMPTZ,
    end_date_param TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalIncome', COALESCE(SUM(CASE WHEN type = 'income' AND status = 'realized' THEN amount ELSE 0 END), 0),
        'totalExpenses', COALESCE(SUM(CASE WHEN type = 'expense' AND status = 'realized' THEN amount ELSE 0 END), 0),
        'totalInvestments', COALESCE(SUM(CASE WHEN type = 'investment' AND status = 'realized' THEN amount ELSE 0 END), 0),
        'plannedIncome', COALESCE(SUM(CASE WHEN type = 'income' AND status = 'planned' THEN amount ELSE 0 END), 0),
        'plannedExpenses', COALESCE(SUM(CASE WHEN type = 'expense' AND status = 'planned' THEN amount ELSE 0 END), 0),
        'transactionCount', COUNT(*)
    )
    INTO result
    FROM public.transactions
    WHERE household_id = household_id_param
    AND date >= start_date_param
    AND date <= end_date_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
