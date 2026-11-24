/** Pure, browser-only updates to the existing JSON-shaped data collections. */
export type RecordRow = Record<string, any>;
export type Collections = Record<string, RecordRow[]>;
export const bookingStatuses = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];
export function rentalDays(
  start: string,
  end: string,
  startTime = "10:00",
  endTime = "10:00",
) {
  return Math.ceil(
    (new Date(`${end}T${endTime}`).getTime() -
      new Date(`${start}T${startTime}`).getTime()) /
      86400000,
  );
}
export function rentalQuote(
  price: number,
  days: number,
  selected: string[],
  services: RecordRow[],
) {
  const subtotal = Math.round(price * days * 100) / 100;
  const extrasTotal =
    Math.round(
      services
        .filter((e) => selected.includes(e.id))
        .reduce(
          (n, e) => n + e.price * (e.id === "airportDelivery" ? 1 : days),
          0,
        ) * 100,
    ) / 100;
  const tax = Math.round((subtotal + extrasTotal) * 7) / 100;
  return {
    subtotal,
    extrasTotal,
    tax,
    total: Math.round((subtotal + extrasTotal + tax) * 100) / 100,
  };
}
export function prepareBooking(data: Collections, draft: RecordRow): RecordRow {
  const old = data.bookings.find((b) => b.id === draft.id);
  const b = { ...old, ...draft };
  const vehicle = data.vehicles.find((v) => v.id === b.vehicleId);
  const customer = data.customers.find((c) => c.id === b.customerId);
  if (
    !vehicle ||
    !customer ||
    !data.locations.some((l) => l.id === b.pickupLocation) ||
    !data.locations.some((l) => l.id === b.returnLocation)
  )
    throw new Error("invalidBookingReferences");
  if (!vehicle.locations.includes(b.pickupLocation))
    throw new Error("invalidPickupLocation");
  const days = rentalDays(
    b.pickupDate,
    b.returnDate,
    b.pickupTime,
    b.returnTime,
  );
  if (!Number.isFinite(days) || days <= 0) throw new Error("validation");
  if (!bookingStatuses.includes(b.status || "pending"))
    throw new Error("validation");
  const allowedMethods = [
    "pickup",
    "card",
    ...(old && ["cash", "transfer"].includes(old.paymentMethod)
      ? [old.paymentMethod]
      : []),
  ];
  if (!allowedMethods.includes(b.paymentMethod)) throw new Error("validation");
  const extras = [...new Set<string>(b.extras || [])];
  if (extras.some((id) => !data.extras.some((e) => e.id === id)))
    throw new Error("validation");
  // Status-only actions must not reprice a historical booking after a fleet rate edit.
  const sameRental =
    old &&
    ["vehicleId", "pickupDate", "returnDate", "pickupTime", "returnTime"].every(
      (k) => old[k] === b[k],
    ) &&
    JSON.stringify(old.extras || []) === JSON.stringify(extras);
  const amounts = sameRental
    ? {
        subtotal: old.subtotal,
        extrasTotal: old.extrasTotal || 0,
        tax: old.tax,
        total: old.total,
      }
    : rentalQuote(vehicle.price, days, extras, data.extras);
  const settlementValid =
    old &&
    old.total === amounts.total &&
    old.paymentMethod === b.paymentMethod &&
    old.customerId === b.customerId;
  const approved =
    b.paymentMethod === "card" &&
    draft.gatewayApproved === true &&
    typeof draft.gatewayReference === "string";
  let paymentStatus = approved
    ? "paid"
    : settlementValid
      ? old.paymentStatus
      : "pending";
  if (b.paymentMethod === "pickup" && draft.pickupPaid === true)
    paymentStatus = "paid";
  if (
    old?.status === "cancelled" &&
    b.status !== "cancelled" &&
    !approved &&
    !draft.pickupPaid
  )
    paymentStatus = "pending";
  if (b.status === "cancelled")
    paymentStatus =
      paymentStatus === "paid" || paymentStatus === "refunded"
        ? "refunded"
        : "cancelled";
  const result: RecordRow = {
    ...b,
    days,
    extras,
    ...amounts,
    status: b.status || "pending",
    paymentStatus,
    gatewayReference: approved
      ? draft.gatewayReference
      : settlementValid
        ? old.gatewayReference
        : undefined,
    customerName: b.firstName
      ? `${b.firstName} ${b.lastName || ""}`.trim()
      : customer.name,
    customerEmail: b.email || customer.email,
  };
  delete result.gatewayApproved;
  delete result.pickupPaid;
  return result;
}
function upsert(rows: RecordRow[], row: RecordRow) {
  return rows.some((x) => x.id === row.id)
    ? rows.map((x) => (x.id === row.id ? row : x))
    : [row, ...rows];
}
export function invoiceForBooking(data: Collections, b: RecordRow): RecordRow {
  const old = data.invoices.find((i) => i.bookingId === b.id);
  const customer = data.customers.find((c) => c.id === b.customerId);
  return {
    ...old,
    id: old?.id || `INV-${b.id}`,
    bookingId: b.id,
    customerId: b.customerId,
    date: old?.date || new Date().toISOString().slice(0, 10),
    subtotal: b.subtotal,
    extrasTotal: b.extrasTotal || 0,
    tax: b.tax,
    total: b.total,
    status: b.paymentStatus,
    customerName:
      b.customerName ||
      (b.firstName
        ? `${b.firstName} ${b.lastName || ""}`.trim()
        : customer?.name),
    customerEmail: b.customerEmail || b.email || customer?.email,
  };
}
export function saveBookingRecords(
  data: Collections,
  draft: RecordRow,
): Collections {
  const old = data.bookings.find((b) => b.id === draft.id);
  const b = prepareBooking(data, draft);
  if (!b.id) throw new Error("validation");
  const bookings = upsert(data.bookings, b);
  const payment = data.payments.find((p) => p.bookingId === b.id);
  const invoices = upsert(data.invoices, invoiceForBooking(data, b));
  const payments = upsert(data.payments, {
    ...payment,
    id: payment?.id || `PAY-${b.id}`,
    bookingId: b.id,
    customerId: b.customerId,
    amount: b.total,
    method: b.paymentMethod,
    status: b.paymentStatus,
    date: payment?.date || new Date().toISOString().slice(0, 10),
    gatewayReference: b.gatewayReference,
  });
  const affected = [old?.vehicleId, b.vehicleId];
  const vehicles = data.vehicles.map((v) =>
    affected.includes(v.id)
      ? {
          ...v,
          status:
            v.status === "maintenance"
              ? "maintenance"
              : bookings.some(
                    (x) => x.vehicleId === v.id && x.status === "active",
                  )
                ? "rented"
                : v.status === "rented"
                  ? "available"
                  : v.status,
        }
      : v,
  );
  return { ...data, bookings, invoices, payments, vehicles };
}
export function ensureInvoiceRecord(
  data: Collections,
  bookingId: string,
): Collections {
  const b = data.bookings.find((b) => b.id === bookingId);
  if (!b) throw new Error("invalidBookingReferences");
  return {
    ...data,
    invoices: upsert(data.invoices, invoiceForBooking(data, b)),
  };
}
