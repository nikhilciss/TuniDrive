import fs from "node:fs";
import assert from "node:assert/strict";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(new URL("../src/data/" + n + ".json", import.meta.url)),
  );
const names = [
  "vehicles",
  "locations",
  "customers",
  "bookings",
  "payments",
  "invoices",
  "maintenance",
  "offers",
  "categories",
  "extras",
  "banners",
  "testimonials",
  "faqs",
];
const data = Object.fromEntries(names.map((n) => [n, read(n)]));
for (const [n, rows] of Object.entries(data)) {
  assert.equal(
    new Set(rows.map((r) => r.id)).size,
    rows.length,
    `${n} unique IDs`,
  );
}
for (const b of data.bookings) {
  assert(data.vehicles.some((v) => v.id === b.vehicleId));
  assert(data.customers.some((c) => c.id === b.customerId));
  assert(data.locations.some((l) => l.id === b.pickupLocation));
  assert(data.locations.some((l) => l.id === b.returnLocation));
  assert(b.returnDate > b.pickupDate);
  assert(Math.abs(b.subtotal + b.extrasTotal + b.tax - b.total) < 0.01);
}
for (const n of ["payments", "invoices"])
  for (const r of data[n]) {
    const b = data.bookings.find((b) => b.id === r.bookingId);
    assert(b);
    assert.equal(r.customerId, b.customerId);
    assert.equal(r.total || r.amount, b.total);
  }
for (const m of data.maintenance)
  assert(data.vehicles.some((v) => v.id === m.vehicleId));
for (const n of ["vehicles", "locations", "offers", "banners"])
  for (const r of data[n])
    assert(
      fs.existsSync(new URL("../public" + r.image, import.meta.url)),
      r.image,
    );
const minimum = {
  vehicles: 20,
  locations: 9,
  customers: 15,
  bookings: 25,
  payments: 20,
  invoices: 20,
  maintenance: 10,
  offers: 6,
  categories: 8,
  extras: 6,
  banners: 3,
  testimonials: 6,
  faqs: 12,
};
for (const [n, count] of Object.entries(minimum))
  assert(data[n].length >= count);
const dictionaries = ["fr", "en", "ar"].map((l) =>
  JSON.parse(
    fs.readFileSync(new URL("../src/locales/" + l + ".json", import.meta.url)),
  ),
);
for (const d of dictionaries)
  assert.deepEqual(Object.keys(d).sort(), Object.keys(dictionaries[0]).sort());
console.log(
  "PASS: dataset sizes, IDs, relationships, dates, totals, local images, and locale key parity",
);
