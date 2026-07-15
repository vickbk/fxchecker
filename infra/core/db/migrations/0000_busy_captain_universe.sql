CREATE TABLE "cx_compare" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"compare_list" text[] DEFAULT '{"EUR","GBP","JPY","AUD","CAD","CHF","CNY","ZAR"}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cx_compare" ADD CONSTRAINT "cx_compare_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;