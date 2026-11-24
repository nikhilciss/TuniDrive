import { test, expect, type Page } from "@playwright/test";
test("home, slider, filters, details, languages and mobile layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await gotoFrench(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "La Tunisie",
  );
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Diapositive suivante", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "arrivée",
  );
  await page
    .getByRole("button", { name: "Diapositive 3", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "élégance",
  );
  await gotoFrench(page, "/fleet?category=suv");
  await expect(page.locator(".car-card")).toHaveCount(4);
  await page
    .getByRole("combobox", { name: "Transmission", exact: true })
    .selectOption("automatic");
  await expect(page.locator(".car-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Réinitialiser", exact: true })
    .click();
  await expect(page.locator(".car-card")).toHaveCount(20);
  await gotoFrench(page, "/fleet/v3");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Renault Clio",
  );
  await page.getByRole("button", { name: "Image 2", exact: true }).click();
  await page.locator(".lang select").selectOption("en");
  await expect(
    page.getByRole("link", { name: "Book now", exact: true }).first(),
  ).toBeVisible();
  await page.locator(".lang select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoFrench(page, "/");
  await page.locator(".lang select").selectOption("ar");
  await page.screenshot({
    path: "test-results/home-mobile-ar.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("complete booking, extras, simulated payment and matching invoice", async ({
  page,
}) => {
  await gotoFrench(page, "/login");
  await page.getByRole("button", { name: "Connexion démo", exact: true }).click();
  await page.locator(".lang select").selectOption("fr");
  await expect(page).toHaveURL("/account");
  await gotoFrench(page, "/login");
  await page.getByRole("button", { name: "Connexion démo", exact: true }).click();
  await page.locator(".lang select").selectOption("fr");
  await page
    .getByRole("link", { name: "Nos véhicules", exact: true })
    .first()
    .click();
  await page
    .getByRole("link", { name: "Réserver", exact: true })
    .filter({ hasText: "Réserver" })
    .nth(1)
    .click();
  await expect(page).toHaveURL(/booking/);
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByText("Siège enfant", { exact: true }).click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page
    .getByText("TuniPay Démo — paiement en ligne", { exact: true })
    .click();
  await page.locator(".booking-form input[type=checkbox]").check();
  await page
    .getByRole("button", { name: "Confirmer la réservation démo" })
    .click();
  await page
    .getByRole("button", { name: "Simuler un paiement réussi", exact: true })
    .click();
  await expect(page).toHaveURL(/confirmation\/TD-/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "réservée",
  );
  const amount = await page.locator(".price-summary .total strong").innerText();
  await page.getByRole("link", { name: "Facture", exact: true }).click();
  await expect(page.locator(".price-summary .total strong")).toHaveText(amount);
  await expect(page.getByText("Payé", { exact: true })).toBeVisible();
});
test("admin login, management, availability, reports and settings", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/wp-admin/login");
  await page.getByRole("button", { name: "Demo sign in", exact: true }).click();
  await page.locator(".lang select").selectOption("fr");
  await expect(
    page.getByRole("heading", { name: "Tableau de bord", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/admin-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Gestion de flotte", exact: true })
    .click();
  await page
    .getByPlaceholder("Rechercher un enregistrement…")
    .fill("Renault Clio");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Modifier", exact: true }).click();
  await page.getByLabel("Prix", { exact: true }).fill("99");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("99 TND");
  await page
    .getByRole("link", { name: "Disponibilités", exact: true })
    .first()
    .click();
  await expect(page.locator(".calendar-table tbody tr")).toHaveCount(20);
  await page.locator(".calendar-cell").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Fermer", exact: true }).click();
  await page
    .getByRole("link", { name: "Réservations", exact: true })
    .first()
    .click();
  await page
    .getByRole("link", { name: "Consulter: TD-26001", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirmer", exact: true }).click();
  await expect(page.locator(".printable .badge").first()).toHaveText(
    "Confirmée",
  );
  await page.getByRole("link", { name: "Rapports", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter CSV" }).click();
  expect((await download).suggestedFilename()).toContain(".csv");
  await page.getByRole("link", { name: "Réglages", exact: true }).click();
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByRole("status")).toBeVisible();
  await page.locator(".lang select").selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("all public pages and local assets render without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/locations",
    "/locations/l1",
    "/offers",
    "/about",
    "/airport",
    "/long-term",
    "/requirements",
    "/insurance",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/cancellation",
    "/demo-access",
    "/register",
    ...Array.from({ length: 20 }, (_, i) => "/fleet/v" + (i + 1)),
  ]) {
    await gotoFrench(page, route);
    await expect(page.locator("body")).not.toBeEmpty();
    await page
      .locator("img")
      .evaluateAll((imgs) => imgs.forEach((im: any) => (im.loading = "eager")));
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every((im: any) => im.complete && im.naturalWidth > 0),
          ),
      )
      .toBeTruthy();
  }
  expect(errors).toEqual([]);
});
test("admin sections, CMS shared content, and linked new reservation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/wp-admin/login");
  await page.getByRole("button", { name: "Demo sign in", exact: true }).click();
  await page.locator(".lang select").selectOption("fr");
  for (const s of [
    "pricing",
    "customers",
    "locations",
    "payments",
    "invoices",
    "maintenance",
    "content",
    "settings",
  ]) {
    await page.locator('.admin-sidebar a[href="/wp-admin/' + s + '"]').click();
    await expect(page.locator(".admin-content")).not.toBeEmpty();
  }
  await page.locator('.admin-sidebar a[href="/wp-admin/content"]').click();
  await page
    .getByRole("button", { name: "Bannières d’accueil", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Modifier", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Titre ou clé de traduction", { exact: true })
    .fill("Votre voyage de démonstration");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await page.getByRole("link", { name: "Voir le site", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Votre voyage de démonstration",
  );
  expect(errors).toEqual([]);
});
test("booking rejects reversed dates and registration creates temporary profile", async ({
  page,
}) => {
  await gotoFrench(page, "/booking/v3");
  await page
    .getByLabel("Date de retour", { exact: true })
    .fill(new Date().toISOString().slice(0, 10));
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await gotoFrench(page, "/register");
  await page.getByLabel("Nom", { exact: true }).fill("Alex Démo");
  await page
    .getByRole("button", { name: "Créer un compte démo", exact: true })
    .click();
  await expect(page).toHaveURL("/account");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Alex");
  await page.locator('.account-nav a[href="/account/support"]').click();
  await page
    .getByLabel("Votre message fictif", { exact: true })
    .fill("Question fictive concernant une location.");
  await page
    .getByRole("button", { name: "Envoyer la demande démo", exact: true })
    .click();
  await expect(page.getByText("REQ-1", { exact: false })).toBeVisible();
});

async function gotoFrench(page: Page, url: string) {
  await page.goto(url);
  await page.locator(".lang select").selectOption("fr");
}
