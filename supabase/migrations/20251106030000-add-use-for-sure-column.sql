-- Add use_for_sure flag to prompts for tracking usage preference
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS use_for_sure boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.prompts.use_for_sure IS 'Indicates if the prompt should be used for sure (true) or maybe (false).';

UPDATE public.prompts
SET use_for_sure = true
WHERE use_for_sure IS NULL;
