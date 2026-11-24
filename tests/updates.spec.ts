import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs/promises";
async function adminLogin(page: Page) {
  await page.goto("/wp-admin/login");
  await expect(page.locator("input[type=email]")).toHaveValue(
    "admin@tunidrive.demo",
  );
  await expect(page.locator("input[type=password]")).toHaveValue("Admin@123");
  await page.getByRole("button", { name: "Demo sign in", exact: true }).click();
  await expect(page).toHaveURL("/wp-admin");
}
async function createBooking(page: Page) {
  await page.locator('a[href="/wp-admin/bookings/new"]').click();
  const modal = page.getByRole("dialog");
  await modal
    .getByRole("combobox", { name: "Customer", exact: true })
    .selectOption("c2");
  await modal
    .getByRole("combobox", { name: "Vehicle", exact: true })
    .selectOption("v3");
  await modal.getByLabel("Pickup date", { exact: true }).fill("2027-04-10");
  await modal.getByLabel("Return date", { exact: true }).fill("2027-04-13");
  await modal
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("confirmed");
  await modal.getByText("Child seat", { exact: true }).click();
  await modal.getByText("Airport delivery", { exact: true }).click();
  await modal.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/\/wp-admin\/bookings\/TD-/);
}
test("English defaults and both prefilled login forms, with French and Arabic retained", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tunisia, at your own pace.",
  );
  await page.goto("/login");
  await expect(page.locator("input[type=email]")).toHaveValue(
    "customer@tunidrive.demo",
  );
  await expect(page.locator("input[type=password]")).toHaveValue(
    "Customer@123",
  );
  await page.locator(".lang select").selectOption("fr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Connexion");
  await page.locator(".lang select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "تسجيل الدخول",
  );
  await adminLogin(page);
});
test("admin creation, edit, invoice generation, PDF downloads, printing and lifecycle", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log(m.text());
  });
  await adminLogin(page);
  await createBooking(page);
  const bookingUrl = page.url();
  await expect(page.locator(".price-summary .total strong")).toHaveText(
    "363,8 TND",
  );
  await page.getByRole("button", { name: "Invoice", exact: true }).click();
  await expect(page.locator(".invoice")).toContainText("Youssef Ben Ali");
  await expect(page.locator(".invoice")).toContainText("55 TND");
  let event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF", exact: true }).click();
  const pdf = await event;
  await pdf.saveAs("test-results/invoice-en.pdf");
  expect(
    (await fs.readFile("test-results/invoice-en.pdf"))
      .subarray(0, 5)
      .toString(),
  ).toBe("%PDF-");
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printed = "yes";
    };
  });
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-printed", "yes");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".admin-sidebar")).toBeHidden();
  await page.emulateMedia({ media: "screen" });
  await page.locator(".lang select").selectOption("ar");
  await expect(page.locator(".invoice")).toContainText(
    "مطار تونس قرطاج الدولي",
  );
  event = page.waitForEvent("download");
  await page.getByRole("button", { name: "تنزيل PDF", exact: true }).click();
  await (await event).saveAs("test-results/invoice-ar.pdf");
  await page.screenshot({
    path: "test-results/invoice-ar.png",
    fullPage: true,
  });
  await page.locator(".lang select").selectOption("en");
  // SPA navigation preserves the generated records.
  await page.locator('.admin-sidebar a[href="/wp-admin/bookings"]').click();
  await page
    .locator(`a[href="${new URL(bookingUrl).pathname}"]`)
    .first()
    .click();
  await expect(page).toHaveURL(bookingUrl);
  await expect(page.locator(".printable")).toBeVisible();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Return date", { exact: true })
    .fill("2027-04-14");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save", exact: true })
    .click();
  await expect(page.locator(".price-summary .total strong")).toHaveText(
    "476,15 TND",
  );
  await page
    .getByRole("button", { name: "Record pickup payment (demo)", exact: true })
    .click();
  await expect(page.locator(".printable .badge.paid")).toBeVisible();
  await page
    .getByRole("button", { name: "Mark as collected", exact: true })
    .click();
  await expect(page.locator(".printable .badge.active")).toBeVisible();
  await page
    .getByRole("button", { name: "Mark as returned", exact: true })
    .click();
  await expect(page.locator(".printable .badge.completed")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".printable .badge.refunded")).toBeVisible();
  await page.getByRole("button", { name: "Invoice", exact: true }).click();
  await expect(page.locator(".invoice .badge")).toHaveText("Refunded");
  await expect(page.locator(".price-summary .total strong")).toHaveText(
    "476,15 TND",
  );
  expect(errors).toEqual([]);
});
test("gateway decline, cancellation and retry never create a paid booking before approval", async ({
  page,
}) => {
  await page.goto("/booking/v3");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByText("TuniPay Demo — online payment", { exact: true })
    .click();
  await page.locator(".booking-form input[type=checkbox]").check();
  await page
    .getByRole("button", { name: "Confirm demo reservation", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("No real card details");
  await expect(page.getByRole("dialog").locator("input")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Simulate declined payment", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Nothing has been charged or saved",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(/\/booking\/v3/);
  await page
    .getByRole("button", { name: "Confirm demo reservation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Simulate declined payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Retry simulated payment", exact: true })
    .click();
  await expect(page).toHaveURL(/confirmation\/TD-/);
  await expect(page.locator(".printable")).toContainText("SIM-");
  await expect(page.locator(".badge.paid")).toBeVisible();
});
test("Arabic customer and admin workflows fit mobile RTL without untranslated controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/booking/v3");
  await page.locator(".lang select").selectOption("ar");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("احجز الآن");
  await expect(page.locator(".booking-form")).toContainText("المرسى");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "متابعة", exact: true }).click();
  await expect(page.locator(".booking-form")).toContainText(
    "الدفع عند الاستلام",
  );
  await expect(page.locator(".booking-form")).toContainText(
    "الدفع عبر الإنترنت",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await adminLogin(page);
  await page.locator(".lang select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator(".admin-header button.menu-toggle").click();
  await page.locator('.admin-sidebar a[href="/wp-admin/bookings"]').click();
  await page.getByRole("button", { name: "إضافة", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("طريقة الدفع");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "test-results/admin-booking-mobile-ar.png",
    fullPage: true,
  });
});
