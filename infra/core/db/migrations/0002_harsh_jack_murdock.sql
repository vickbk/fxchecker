CREATE TABLE "ex_favorites" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"favorite_pairs" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ex_favorites" ADD CONSTRAINT "ex_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;