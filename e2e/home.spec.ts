import { test, expect } from "@playwright/test";

test("opens drawer with the sidebar account section and links on the mobile devices", async ({
	page,
}) => {
	await page.goto("/");

	await page.getByLabel("User profile menu").click();

	const accountInfo = page.getByLabel("Account");
	await expect(accountInfo).toBeVisible()
});

