import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const serverConfig = Object.freeze({ port: 5173 });

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	appType: "spa",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: serverConfig.port,
		strictPort: true,
	},
});
