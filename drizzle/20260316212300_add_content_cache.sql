CREATE TABLE IF NOT EXISTS "content_cache" (
	"cache_key" varchar(512) PRIMARY KEY NOT NULL,
	"cache_value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "content_cache_expires_idx" ON "content_cache" USING btree ("expires_at");
