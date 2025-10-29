-- Storage bucket for transaction artifacts
INSERT INTO storage.buckets (id, name, public)
VALUES ('transaction-artifacts', 'transaction-artifacts', false);

-- Storage policies for transaction artifacts
CREATE POLICY "Users can upload artifacts to their household"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'transaction-artifacts' AND
    EXISTS (
        SELECT 1 FROM public.household_members
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view artifacts from their households"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'transaction-artifacts' AND
    EXISTS (
        SELECT 1 FROM public.artifacts a
        JOIN public.household_members hm ON hm.household_id = a.household_id
        WHERE a.storage_path = name AND hm.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own artifacts"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'transaction-artifacts' AND
    EXISTS (
        SELECT 1 FROM public.artifacts a
        WHERE a.storage_path = name AND a.user_id = auth.uid()
    )
);

-- Storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
