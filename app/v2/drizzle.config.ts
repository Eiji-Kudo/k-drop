import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./functions/db/schema/index.ts",
	out: "./functions/db/migrations",
});
