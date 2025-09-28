import { it, describe } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

import { ShellNav } from "./ShellNav";

describe("ShellNav - header for application shell", () => {
  it("should open the sidebar menu upon clicking on the hamburger menu", async () => {
    const { getByRole } = render(<ShellNav />);
    const hamburger = await getByRole('button', { name: 'Toggle menu' })

    await userEvent.click(hamburger);
  });
});
