import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
const source = fs.readFileSync(
  new URL("../src/booking-model.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const { saveBookingRecords, ensureInvoiceRecord, prepareBooking } =
  await import(
    "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
  );
const fixtures = () =>
  Object.fromEntries(
    [
      "bookings",
      "vehicles",
      "customers",
      "locations",
      "payments",
      "invoices",
      "extras",
    ].map((k) => [
      k,
      JSON.parse(
        fs.readFileSync(
          new URL("../src/data/" + k + ".json", import.meta.url),
          "utf8",
        ),
      ),
    ]),
  );
const draft = {
  id: "TD-TEST",
  customerId: "c2",
  vehicleId: "v3",
  pickupLocation: "l3",
  returnLocation: "l1",
  pickupDate: "2027-04-10",
  returnDate: "2027-04-13",
  pickupTime: "10:00",
  returnTime: "10:00",
  extras: ["childSeat", "airportDelivery"],
  paymentMethod: "pickup",
  status: "confirmed",
};
test("new booking and all linked records share extras, taxes, customer and total", () => {
  const original = fixtures();
  const d = saveBookingRecords(original, draft);
  const b = d.bookings.find((b) => b.id === draft.id);
  assert.equal(b.subtotal, 285);
  assert.equal(b.extrasTotal, 55);
  assert.equal(b.total, 363.8);
  assert.equal(original.bookings.length, 25);
  assert.equal(d.invoices.find((i) => i.bookingId === b.id).total, b.total);
  assert.equal(d.payments.find((p) => p.bookingId === b.id).amount, b.total);
  assert.equal(d.invoices.find((i) => i.bookingId === b.id).customerId, "c2");
});
test("editing synchronizes existing invoice/payment without duplicate generation", () => {
  let d = saveBookingRecords(fixtures(), draft);
  const invoiceId = d.invoices.find((i) => i.bookingId === draft.id).id;
  d = saveBookingRecords(d, {
    ...draft,
    returnDate: "2027-04-14",
    extras: ["childSeat"],
  });
  d = ensureInvoiceRecord(d, draft.id);
  d = ensureInvoiceRecord(d, draft.id);
  const b = d.bookings.find((b) => b.id === draft.id);
  assert.equal(b.total, 449.4);
  assert.equal(d.invoices.filter((i) => i.bookingId === b.id).length, 1);
  assert.equal(d.invoices.find((i) => i.bookingId === b.id).id, invoiceId);
  assert.equal(d.payments.find((p) => p.bookingId === b.id).amount, 449.4);
});
test("settlement and cancellation synchronize statuses; status action preserves price", () => {
  let d = saveBookingRecords(fixtures(), {
    ...draft,
    paymentMethod: "card",
    gatewayApproved: true,
    gatewayReference: "SIM-TEST",
  });
  d.vehicles = d.vehicles.map((v) =>
    v.id === "v3" ? { ...v, price: 999 } : v,
  );
  d = saveBookingRecords(d, { id: draft.id, status: "active" });
  assert.equal(d.bookings.find((b) => b.id === draft.id).total, 363.8);
  assert.equal(d.vehicles.find((v) => v.id === "v3").status, "rented");
  d = saveBookingRecords(d, { id: draft.id, status: "cancelled" });
  for (const collection of ["bookings", "invoices", "payments"]) {
    const r = d[collection].find((r) =>
      collection === "bookings" ? r.id === draft.id : r.bookingId === draft.id,
    );
    assert.equal(
      collection === "bookings" ? r.paymentStatus : r.status,
      "refunded",
    );
  }
  assert.equal(d.vehicles.find((v) => v.id === "v3").status, "available");
});
test("invalid dates and foreign keys cannot mutate fixtures", () => {
  const d = fixtures();
  for (const invalid of [
    { returnDate: "2027-04-09" },
    { customerId: "missing" },
    { vehicleId: "missing" },
    { pickupLocation: "l9" },
    { extras: ["not-a-service"] },
  ])
    assert.throws(() => prepareBooking(d, { ...draft, ...invalid }));
  assert.equal(d.bookings.length, 25);
});
test("changing a paid amount requires new simulated settlement", () => {
  let d = saveBookingRecords(fixtures(), {
    ...draft,
    paymentMethod: "card",
    gatewayApproved: true,
    gatewayReference: "SIM-ORIGINAL",
  });
  d = saveBookingRecords(d, { id: draft.id, returnDate: "2027-04-20" });
  assert.equal(
    d.payments.find((p) => p.bookingId === draft.id).status,
    "pending",
  );
  assert.equal(
    d.payments.find((p) => p.bookingId === draft.id).gatewayReference,
    undefined,
  );
});
