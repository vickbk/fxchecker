ALTER TABLE "ex_logs" ALTER COLUMN "data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ex_logs" ALTER COLUMN "edit_time" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ex_logs" ALTER COLUMN "edit_time" SET DEFAULT now();