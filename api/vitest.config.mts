import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		exclude: [...configDefaults.exclude, "**/*.db.spec.ts"],
	},
	resolve: {
		tsconfigPaths: true,
	},
});
