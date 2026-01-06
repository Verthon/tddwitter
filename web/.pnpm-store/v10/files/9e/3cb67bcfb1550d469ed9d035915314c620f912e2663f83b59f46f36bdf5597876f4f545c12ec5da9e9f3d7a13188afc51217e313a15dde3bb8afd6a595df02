import { i as renderHook, r as render, t as cleanup } from "./pure-D75AjICB.js";
import { page } from "vitest/browser";
import { beforeEach } from "vitest";

//#region src/index.ts
page.extend({
	render,
	[Symbol.for("vitest:component-cleanup")]: cleanup
});
beforeEach(async () => {
	await cleanup();
});

//#endregion
export { cleanup, render, renderHook };