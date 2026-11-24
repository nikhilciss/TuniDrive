import { useState } from "react";
import { useApp, Row, money, duration, quote } from "../store";
import { prepareBooking, bookingStatuses } from "../booking-model";
import { Field } from "./UI";
import { SimulatedGateway } from "./SimulatedGateway";
export function BookingEditor({
  row,
  onSave,
}: {
  row: Row;
  onSave: (values: Row) => void;
}) {
  const { data, t } = useApp();
  const vehicle =
    data.vehicles.find((v) => v.status === "available") || data.vehicles[0];
  const today = new Date().toISOString().slice(0, 10);
  const [value, setValue] = useState<Row>({
    customerId: data.customers[0]?.id,
    vehicleId: vehicle?.id,
    pickupLocation: vehicle?.locations[0],
    returnLocation: vehicle?.locations[0],
    pickupDate: today,
    returnDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    pickupTime: "10:00",
    returnTime: "10:00",
    status: "pending",
    paymentMethod: "pickup",
    extras: ["basicInsurance", "roadside"],
    requests: "",
    ...row,
  });
  const [error, setError] = useState("");
  const [gateway, setGateway] = useState<Row | null>(null);
  const selectedVehicle = data.vehicles.find((v) => v.id === value.vehicleId);
  const days = duration(
    value.pickupDate,
    value.returnDate,
    value.pickupTime,
    value.returnTime,
  );
  let amounts = quote(
    selectedVehicle?.price || 0,
    Math.max(1, days || 1),
    value.extras || [],
    data.extras,
  );
  try {
    const prepared = prepareBooking(data, value);
    amounts = {
      subtotal: prepared.subtotal,
      extrasTotal: prepared.extrasTotal,
      tax: prepared.tax,
      total: prepared.total,
    };
  } catch {
    /* Incomplete form: display the provisional quote until validation. */
  }
  const set = (key: string, v: any) =>
    setValue((old) => ({ ...old, [key]: v }));
  const submit = () => {
    try {
      const prepared = prepareBooking(data, value);
      if (
        prepared.paymentMethod === "card" &&
        prepared.paymentStatus === "pending" &&
        prepared.status !== "cancelled"
      ) {
        setGateway(value);
        return;
      }
      onSave(value);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          submit();
        }}
      >
        <div className="form-grid">
          <Field label={t("customer")}>
            <select
              required
              value={value.customerId}
              onChange={(e) => {
                const customer = data.customers.find(
                  (c) => c.id === e.target.value,
                );
                setValue((v) => ({
                  ...v,
                  customerId: e.target.value,
                  firstName: undefined,
                  lastName: undefined,
                  email: customer?.email,
                  customerName: undefined,
                  customerEmail: undefined,
                }));
              }}
            >
              {data.customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.email}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("vehicle")}>
            <select
              required
              value={value.vehicleId}
              onChange={(e) => {
                const car = data.vehicles.find((v) => v.id === e.target.value)!;
                setValue((v) => ({
                  ...v,
                  vehicleId: car.id,
                  pickupLocation: car.locations[0],
                }));
              }}
            >
              {data.vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · {money(v.price)}
                </option>
              ))}
            </select>
          </Field>
          {["pickupLocation", "returnLocation"].map((k) => (
            <Field key={k} label={t(k)}>
              <select
                required
                value={value[k]}
                onChange={(e) => set(k, e.target.value)}
              >
                {data.locations
                  .filter(
                    (l) =>
                      k === "returnLocation" ||
                      selectedVehicle?.locations.includes(l.id),
                  )
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {t(l.name)}
                    </option>
                  ))}
              </select>
            </Field>
          ))}
          {["pickupDate", "pickupTime", "returnDate", "returnTime"].map((k) => (
            <Field key={k} label={t(k)}>
              <input
                required
                type={k.endsWith("Date") ? "date" : "time"}
                value={value[k]}
                onChange={(e) => set(k, e.target.value)}
              />
            </Field>
          ))}
          <Field label={t("status")}>
            <select
              value={value.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {bookingStatuses.map((s) => (
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("paymentMethod")}>
            <select
              value={value.paymentMethod}
              onChange={(e) => set("paymentMethod", e.target.value)}
            >
              {[
                "pickup",
                "card",
                ...(["cash", "transfer"].includes(row.paymentMethod)
                  ? [row.paymentMethod]
                  : []),
              ].map((m) => (
                <option key={m} value={m}>
                  {t(
                    m === "pickup"
                      ? "pickupPayment"
                      : m === "card"
                        ? "demoGateway"
                        : m,
                  )}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <h3>{t("extras")}</h3>
        <div className="extras-list">
          {data.extras.map((e) => (
            <label key={e.id}>
              <input
                type="checkbox"
                checked={value.extras?.includes(e.id) || false}
                onChange={(event) =>
                  set(
                    "extras",
                    event.target.checked
                      ? [...(value.extras || []), e.id]
                      : value.extras.filter((id: string) => id !== e.id),
                  )
                }
              />
              <div>
                <strong>{t(e.id)}</strong>
                <small>
                  {t(e.id === "airportDelivery" ? "oneTime" : "perDay")}
                </small>
              </div>
              <strong>{money(e.price)}</strong>
            </label>
          ))}
        </div>
        <Field label={t("requests")}>
          <textarea
            value={value.requests || ""}
            onChange={(e) => set("requests", e.target.value)}
          />
        </Field>
        <div className="price-summary">
          {["subtotal", "extrasTotal", "tax", "total"].map((k) => (
            <div key={k} className={k === "total" ? "total" : ""}>
              <span>
                {t(k)}
                {k === "subtotal"
                  ? ` · ${Math.max(1, days || 1)} ${t("days")}`
                  : ""}
              </span>
              <strong>{money(amounts[k as keyof typeof amounts])}</strong>
            </div>
          ))}
        </div>
        <p className="notice">{t("demoNote")}</p>
        {error && (
          <p role="alert" className="error">
            {t(error)}
          </p>
        )}
        <button className="btn" type="submit">
          {t("save")}
        </button>
      </form>
      {gateway && (
        <SimulatedGateway
          amount={amounts.total}
          onCancel={() => setGateway(null)}
          onApproved={(reference) => {
            onSave({
              ...gateway,
              gatewayApproved: true,
              gatewayReference: reference,
            });
            setGateway(null);
          }}
        />
      )}
    </>
  );
}
