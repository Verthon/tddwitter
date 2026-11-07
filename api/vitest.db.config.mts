import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		include: ["src/**/*.db.spec.ts"],
		globalSetup: ["src/common/test-utils/testDbGlobalSetup.ts"],
		fileParallelism: false,
	},
	resolve: {
		tsconfigPaths: true,
	},
});
