CREATE TABLE "ex_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"data" text,
	"edit_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ex_logs" ADD CONSTRAINT "ex_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;