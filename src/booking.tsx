import { SimulatedGateway } from "./components/SimulatedGateway";
import { useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import {
  Check,
  Eye,
  EyeOff,
  Printer,
  Mail,
  MessageCircle,
  Download,
} from "lucide-react";
import { useApp, money, duration, quote, Row } from "./store";
import { Field, PageTitle, Badge, CarCard } from "./components/UI";
import { NotFound } from "./pages";
export function BookingFlow() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { t, data, saveBooking, notify, user } = useApp();
  const nav = useNavigate();
  const v = data.vehicles.find((x) => x.id === id);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([
    "basicInsurance",
    "roadside",
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Record<string, string>>({
    pickupLocation: params.get("location") || v?.locations[0] || "l1",
    returnLocation:
      params.get("returnLocation") ||
      params.get("location") ||
      v?.locations[0] ||
      "l1",
    pickupDate: params.get("pickupDate") || today,
    returnDate:
      params.get("returnDate") ||
      new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    pickupTime: params.get("pickupTime") || "10:00",
    returnTime: params.get("returnTime") || "10:00",
    firstName: "Camille",
    lastName: "Démo",
    email: "customer@tunidrive.demo",
    phone: "+216 XX XXX XXX",
    country: "France",
    licence: "DEMO-2026",
    requests: "",
    paymentMethod: "pickup",
  });
  const [error, setError] = useState("");
  const [gateway, setGateway] = useState(false);
  if (!v) return <NotFound />;
  const days = duration(
    form.pickupDate,
    form.returnDate,
    form.pickupTime,
    form.returnTime,
  );
  const amounts = quote(v.price, Math.max(1, days || 1), selected, data.extras);
  const set = (k: string, x: string) => setForm((f) => ({ ...f, [k]: x }));
  const steps = [
    "rentalDetails",
    "extras",
    "customerInfo",
    "payment",
    "confirmation",
  ];
  const submit = () => {
    if (
      step === 0 &&
      (!Number.isFinite(days) || days <= 0 || form.pickupDate < today)
    ) {
      setError(t("validation"));
      return;
    }
    if (step === 2 && !form.licence.startsWith("DEMO")) {
      setError(t("licence"));
      return;
    }
    setError("");
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (form.paymentMethod === "card") {
      setGateway(true);
      return;
    }
    finish();
  };
  const finish = (reference?: string) => {
    try {
      const ref = saveBooking({
        ...form,
        vehicleId: v.id,
        customerId: user || "c1",
        extras: selected,
        status: "confirmed",
        gatewayApproved: Boolean(reference),
        gatewayReference: reference,
      });
      notify(t("emailDone"));
      nav("/confirmation/" + ref);
    } catch (e) {
      setError(t((e as Error).message));
      setGateway(false);
    }
  };
  return (
    <main className="container section">
      <PageTitle title={t("book")} sub={t("demoNote")} />
      {gateway && (
        <SimulatedGateway
          amount={amounts.total}
          onCancel={() => setGateway(false)}
          onApproved={finish}
        />
      )}
      <div className="booking-progress">
        {steps.map((s, i) => (
          <div className={i <= step ? "active" : ""} key={s}>
            <span>{i < step ? <Check size={16} /> : i + 1}</span>
            {t(s)}
          </div>
        ))}
      </div>
      <div className="detail-grid">
        <form
          className="card booking-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <h2>{t(steps[step])}</h2>
          {step === 0 && (
            <div className="form-grid">
              {["pickupLocation", "returnLocation"].map((k) => (
                <Field key={k} label={t(k === "pickupLocation" ? "pickup" : k)}>
                  <select
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                  >
                    {data.locations
                      .filter(
                        (l) =>
                          k === "returnLocation" || v.locations.includes(l.id),
                      )
                      .map((l) => (
                        <option value={l.id} key={l.id}>
                          {t(l.name)}
                        </option>
                      ))}
                  </select>
                </Field>
              ))}
              {["pickupDate", "pickupTime", "returnDate", "returnTime"].map(
                (k) => (
                  <Field key={k} label={t(k)}>
                    <input
                      required
                      type={k.endsWith("Date") ? "date" : "time"}
                      min={k.endsWith("Date") ? today : undefined}
                      value={form[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </Field>
                ),
              )}
            </div>
          )}
          {step === 1 && (
            <div className="extras-list">
              {data.extras.map((x) => (
                <label key={x.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(x.id)}
                    disabled={x.price === 0}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, x.id]
                          : selected.filter((s) => s !== x.id),
                      )
                    }
                  />
                  <div>
                    <strong>{t(x.id)}</strong>
                    <small>
                      {x.id === "airportDelivery" ? t("airport") : t("perDay")}
                    </small>
                  </div>
                  <strong>{money(x.price)}</strong>
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <>
              <div className="notice">
                {t("demoNote")} {t("rulesText")}
              </div>
              <div className="form-grid">
                {[
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "country",
                  "licence",
                ].map((k) => (
                  <Field key={k} label={t(k)}>
                    <input
                      required
                      type={k === "email" ? "email" : "text"}
                      value={form[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </Field>
                ))}
                <Field label={t("requests")}>
                  <textarea
                    value={form.requests}
                    onChange={(e) => set("requests", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="notice">{t("demoNote")}</div>
              {["pickup", "card"].map((method) => (
                <label className="payment-option" key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={form.paymentMethod === method}
                    onChange={() => set("paymentMethod", method)}
                  />
                  <strong>
                    {t(method === "pickup" ? "pickupPayment" : "demoGateway")}
                  </strong>
                  {method === "card" && <span>DEMO •••• 4242</span>}
                </label>
              ))}
              <PriceSummary amounts={amounts} days={days} />
              <label className="check-label">
                <input type="checkbox" required />
                <Link to="/terms" target="_blank">
                  {t("terms")}
                </Link>{" "}
                · {t("demo")}
              </label>
            </>
          )}
          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
          <div className="row form-actions">
            <button
              type="button"
              disabled={step === 0}
              className="btn outline"
              onClick={() => setStep(step - 1)}
            >
              {t("back")}
            </button>
            <button className="btn" type="submit">
              {t(step === 3 ? "confirmBooking" : "next")}
            </button>
          </div>
        </form>
        <aside className="card booking-aside">
          <img src={v.image} alt={t("illustration")} />
          <h2>{v.name}</h2>
          <p>
            {t(v.category)} · {t(v.transmission)}
          </p>
          <hr />
          <p>
            {t(
              data.locations.find((l) => l.id === form.pickupLocation)?.name ||
                "",
            )}
          </p>
          <p>
            {form.pickupDate} {form.pickupTime}
            <br />
            {form.returnDate} {form.returnTime}
          </p>
          <PriceSummary amounts={amounts} days={days} />
        </aside>
      </div>
    </main>
  );
}
export function PriceSummary({
  amounts,
  days,
}: {
  amounts: Row;
  days: number;
}) {
  const { t } = useApp();
  return (
    <div className="price-summary">
      <div>
        <span>
          {t("rental")} · {Math.max(1, days || 1)} {t("days")}
        </span>
        <strong>{money(amounts.subtotal)}</strong>
      </div>
      <div>
        <span>{t("extras")}</span>
        <strong>{money(amounts.extrasTotal || 0)}</strong>
      </div>
      <div>
        <span>{t("tax")}</span>
        <strong>{money(amounts.tax)}</strong>
      </div>
      <div className="total">
        <span>{t("total")}</span>
        <strong>{money(amounts.total)}</strong>
      </div>
    </div>
  );
}
export function BookingDetails({
  confirmation = false,
}: {
  confirmation?: boolean;
}) {
  const { id } = useParams();
  const { data, t, notify, admin, generateInvoice } = useApp();
  const nav = useNavigate();
  const b = data.bookings.find((x) => x.id === id);
  if (!b) return <NotFound />;
  const v = data.vehicles.find((v) => v.id === b.vehicleId);
  const c = data.customers.find((c) => c.id === b.customerId);
  const invoice = data.invoices.find((x) => x.bookingId === id);
  return (
    <main className="container section narrow">
      <div className="center">
        {confirmation && (
          <div className="success-circle">
            <Check size={36} />
          </div>
        )}
        <PageTitle
          title={t(confirmation ? "bookingSuccess" : "details")}
          sub={t("demoNote")}
        />
      </div>
      <div className="card printable">
        <div className="row">
          <h2>{b.id}</h2>
          <Badge value={b.status} />
        </div>
        <div className="booking-car">
          <img src={v?.image} alt={t("illustration")} />
          <div>
            <h2>{v?.name}</h2>
            <p>{b.firstName ? b.firstName + " " + b.lastName : c?.name}</p>
            <p>{b.email || c?.email}</p>
          </div>
        </div>
        <div className="spec-grid">
          <div>
            <small>{t("pickup")}</small>
            <strong>
              {t(
                data.locations.find((l) => l.id === b.pickupLocation)?.name ||
                  "",
              )}
            </strong>
            <span>
              {b.pickupDate} · {b.pickupTime}
            </span>
          </div>
          <div>
            <small>{t("returnLocation")}</small>
            <strong>
              {t(
                data.locations.find((l) => l.id === b.returnLocation)?.name ||
                  "",
              )}
            </strong>
            <span>
              {b.returnDate} · {b.returnTime}
            </span>
          </div>
          <div>
            <small>{t("payment")}</small>
            <strong>
              {t(
                b.paymentMethod === "pickup"
                  ? "pickupPayment"
                  : b.paymentMethod,
              )}
            </strong>
            <Badge value={b.paymentStatus} />
          </div>
        </div>
        {b.extras?.length > 0 && (
          <div className="chips">
            {b.extras.map((id: string) => (
              <span key={id}>{t(id)}</span>
            ))}
          </div>
        )}
        {b.requests && (
          <p>
            {t("requests")}: {b.requests}
          </p>
        )}
        {b.gatewayReference && (
          <p>
            {t("transactionReference")}: <bdi>{b.gatewayReference}</bdi>
          </p>
        )}
        <PriceSummary amounts={b} days={b.days} />
      </div>
      <div className="button-row no-print">
        <button className="btn outline" onClick={() => window.print()}>
          <Printer size={17} />
          {t("print")}
        </button>
        <button className="btn outline" onClick={() => notify(t("emailDone"))}>
          <Mail size={17} />
          {t("emailLabel")}
        </button>
        <button
          className="btn outline"
          onClick={() => notify(t("whatsappDone"))}
        >
          <MessageCircle size={17} />
          WhatsApp
        </button>
        {invoice && (
          <Link
            className="btn outline"
            to={
              (admin ? "/wp-admin/invoices/" : "/account/invoices/") +
              invoice.id
            }
          >
            {t("invoice")}
          </Link>
        )}
        {!invoice && (
          <button
            className="btn outline"
            onClick={() =>
              nav(
                (admin ? "/wp-admin/invoices/" : "/account/invoices/") +
                  generateInvoice(b.id),
              )
            }
          >
            {t("generateInvoice")}
          </button>
        )}
        <Link
          className="btn"
          to={admin ? "/wp-admin/bookings" : "/account/bookings"}
        >
          {t("bookings")}
        </Link>
      </div>
    </main>
  );
}
export function Invoice() {
  const { id } = useParams();
  const { data, t, notify } = useApp();
  const invoiceRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const { downloadInvoicePDF } = await import("./invoice-pdf");
      await downloadInvoicePDF(invoiceRef.current, id!);
    } catch (error) {
      console.error(error);
      notify(t("pdfFailed"));
    } finally {
      setDownloading(false);
    }
  };
  const inv = data.invoices.find((x) => x.id === id);
  if (!inv) return <NotFound />;
  const b = data.bookings.find((x) => x.id === inv.bookingId);
  if (!b) return <NotFound />;
  const c = data.customers.find((x) => x.id === inv.customerId);
  const v = data.vehicles.find((x) => x.id === b?.vehicleId);
  return (
    <main className="container section narrow">
      <div className="row no-print">
        <h1>{t("invoice")}</h1>
        <div className="button-row">
          <button
            className="btn outline"
            onClick={download}
            disabled={downloading}
          >
            <Download size={18} />
            {t(downloading ? "generatingPDF" : "downloadPDF")}
          </button>
          <button className="btn" onClick={() => window.print()}>
            <Printer size={18} />
            {t("print")}
          </button>
        </div>
      </div>
      <article ref={invoiceRef} className="card invoice printable">
        <div className="row">
          <img src="/assets/logo.svg" alt="TuniDrive" width="180" />
          <Badge value={inv.status} />
        </div>
        <hr />
        <div className="row">
          <div>
            <h2>{inv.id}</h2>
            <p>
              {inv.date} · {inv.bookingId}
            </p>
          </div>
          <div>
            <strong>
              {inv.customerName ||
                b?.customerName ||
                (b?.firstName ? `${b.firstName} ${b.lastName || ""}` : c?.name)}
            </strong>
            <p>{inv.customerEmail || b?.email || c?.email}</p>
          </div>
        </div>
        <h3>{v?.name}</h3>
        <p>
          {b?.pickupDate} — {b?.returnDate}
        </p>
        <p>
          {t("pickup")}:{" "}
          {t(
            data.locations.find((l) => l.id === b?.pickupLocation)?.name || "",
          )}
          <br />
          {t("returnLocation")}:{" "}
          {t(
            data.locations.find((l) => l.id === b?.returnLocation)?.name || "",
          )}
        </p>
        {b?.extras?.length > 0 && (
          <div className="chips">
            {b.extras.map((key: string) => (
              <span key={key}>{t(key)}</span>
            ))}
          </div>
        )}
        <p>
          {t("paymentMethod")}:{" "}
          {t(
            b?.paymentMethod === "pickup"
              ? "pickupPayment"
              : b?.paymentMethod === "card"
                ? "demoGateway"
                : b?.paymentMethod || "",
          )}
        </p>
        {b?.gatewayReference && (
          <p>
            {t("transactionReference")}: <bdi>{b.gatewayReference}</bdi>
          </p>
        )}
        <PriceSummary
          amounts={{
            ...inv,
            extrasTotal: inv.extrasTotal ?? b?.extrasTotal ?? 0,
          }}
          days={b?.days || 1}
        />
        <p className="notice">
          {t("demoNote")} {t("policyNote")}
        </p>
      </article>
    </main>
  );
}
export function Login({
  admin = false,
  register = false,
}: {
  admin?: boolean;
  register?: boolean;
}) {
  const { t, setUser, setAdmin, notify, data, setRows } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(
    admin ? "admin@tunidrive.demo" : "customer@tunidrive.demo",
  );
  const [password, setPassword] = useState(
    admin ? "Admin@123" : "Customer@123",
  );
  const [error, setError] = useState(false);
  const [registeredName, setRegisteredName] = useState("Camille Démo");
  const login = (direct = false) => {
    if (
      !direct &&
      !register &&
      (email !== (admin ? "admin@tunidrive.demo" : "customer@tunidrive.demo") ||
        password !== (admin ? "Admin@123" : "Customer@123"))
    ) {
      setError(true);
      return;
    }
    if (admin) {
      setAdmin(true);
      nav("/wp-admin");
    } else {
      if (register) {
        const newId = "c" + (data.customers.length + 1);
        setRows("customers", [
          ...data.customers,
          {
            id: newId,
            name: registeredName,
            email,
            phone: "+216 XX XXX XXX",
            country: "France",
            status: "active",
            joined: new Date().toISOString().slice(0, 10),
          },
        ]);
        setUser(newId);
      } else setUser("c1");
      nav("/account");
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-photo">
        <h2>{t("heroTitle")}</h2>
        <p>{t("eyebrow")}</p>
      </div>
      <div className="auth-content">
        <div className="eyebrow">TUNIDRIVE {admin ? t("admin") : ""}</div>
        <h1>{t(register ? "register" : "login")}</h1>
        <p>{t("demoNote")}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          {register && (
            <Field label={t("name")}>
              <input
                required
                value={registeredName}
                onChange={(e) => setRegisteredName(e.target.value)}
              />
            </Field>
          )}
          <Field label={t("email")}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label={t("password")}>
            <div className="password">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type="button"
                aria-label={t("password")}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          {error && (
            <p className="error">
              {t("credentials")}:{" "}
              {admin
                ? "admin@tunidrive.demo / Admin@123"
                : "customer@tunidrive.demo / Customer@123"}
            </p>
          )}
          <button className="btn full">
            {t(register ? "register" : "login")}
          </button>
        </form>
        <button className="btn outline full" onClick={() => login(true)}>
          {t("demoLogin")}
        </button>
        <div className="row">
          <button className="text-link" onClick={() => notify(t("emailDone"))}>
            {t("forgot")}
          </button>
          {!admin && (
            <Link to={register ? "/login" : "/register"}>
              {t(register ? "login" : "register")}
            </Link>
          )}
        </div>
        <div className="notice">
          <strong>{t("credentials")}</strong>
          <p>
            {admin ? "admin@tunidrive.demo" : "customer@tunidrive.demo"}
            <br />
            {admin ? "Admin@123" : "Customer@123"}
          </p>
        </div>
        <Link className="text-link" to="/demo-access">
          {t("demoAccess")}
        </Link>
      </div>
    </main>
  );
}
export function DemoAccess() {
  const { t } = useApp();
  return (
    <main className="container section">
      <PageTitle title={t("demoAccess")} sub={t("demoNote")} />
      <div className="two-columns">
        {[false, true].map((a) => (
          <div key={String(a)} className="card">
            <h2>{t(a ? "admin" : "customerPortal")}</h2>
            <p>{a ? "admin@tunidrive.demo" : "customer@tunidrive.demo"}</p>
            <p>{a ? "Admin@123" : "Customer@123"}</p>
            <Link className="btn" to={a ? "/wp-admin/login" : "/login"}>
              {t("demoLogin")}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
export function Account() {
  const { section = "dashboard" } = useParams();
  const { user, setUser, t, data, setRows, notify, saved } = useApp();
  const [filter, setFilter] = useState("all");
  if (!user) return <Navigate to="/login" replace />;
  const customer = data.customers.find((x) => x.id === user)!;
  const bookings = data.bookings.filter((b) => b.customerId === user);
  return (
    <main className="container section">
      <PageTitle
        title={t("welcome") + ", " + customer.name.split(" ")[0]}
        sub={t("demoNote")}
      />
      <div className="account-layout">
        <aside className="account-nav">
          {[
            "dashboard",
            "bookings",
            "invoices",
            "payments",
            "profile",
            "saved",
            "support",
          ].map((s) => (
            <Link
              className={section === s ? "active" : ""}
              key={s}
              to={s === "dashboard" ? "/account" : "/account/" + s}
            >
              {t(s)}
            </Link>
          ))}
          <button onClick={() => setUser(null)}>{t("logout")}</button>
        </aside>
        <section>
          {section === "dashboard" ? (
            <>
              <div className="stats-grid">
                {["confirmed", "active", "completed", "cancelled"].map((s) => (
                  <div className="stat card" key={s}>
                    <span>{t(s)}</span>
                    <strong>
                      {bookings.filter((b) => b.status === s).length}
                    </strong>
                  </div>
                ))}
              </div>
              <h2>{t("bookings")}</h2>
              {bookings.map((b) => (
                <BookingRow key={b.id} b={b} />
              ))}
            </>
          ) : section === "bookings" ? (
            <>
              <div className="tabs">
                {[
                  "all",
                  "pending",
                  "confirmed",
                  "active",
                  "completed",
                  "cancelled",
                ].map((s) => (
                  <button
                    className={s === filter ? "active" : ""}
                    key={s}
                    onClick={() => setFilter(s)}
                  >
                    {t(s)}
                  </button>
                ))}
              </div>
              {bookings
                .filter((b) => filter === "all" || b.status === filter)
                .map((b) => (
                  <BookingRow key={b.id} b={b} />
                ))}
              {!bookings.some(
                (b) => filter === "all" || b.status === filter,
              ) && <div className="empty">{t("empty")}</div>}
            </>
          ) : section === "invoices" || section === "payments" ? (
            <div className="card">
              {data[section]
                .filter((x) => x.customerId === user)
                .map((x) => (
                  <div className="record-line" key={x.id}>
                    <strong>{x.id}</strong>
                    <span>{money(x.total || x.amount)}</span>
                    <Badge value={x.status} />
                    <Link
                      className="text-link"
                      to={
                        section === "invoices"
                          ? "/account/invoices/" + x.id
                          : "/account/bookings/" + x.bookingId
                      }
                    >
                      {t("details")}
                    </Link>
                  </div>
                ))}
            </div>
          ) : section === "saved" ? (
            <div className="car-grid two">
              {data.vehicles
                .filter((v) => saved.includes(v.id))
                .map((v) => (
                  <CarCard key={v.id} v={v} />
                ))}
              {!saved.length && (
                <div className="empty">
                  {t("empty")}
                  <p>
                    <Link to="/fleet">{t("fleet")}</Link>
                  </p>
                </div>
              )}
            </div>
          ) : section === "profile" ? (
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                const f = Object.fromEntries(new FormData(e.currentTarget));
                setRows(
                  "customers",
                  data.customers.map((c) =>
                    c.id === user ? { ...c, ...f } : c,
                  ),
                );
                notify(t("success"));
              }}
            >
              <h2>{t("profile")}</h2>
              {["name", "email", "phone", "country"].map((k) => (
                <Field key={k} label={t(k)}>
                  <input name={k} required defaultValue={customer[k]} />
                </Field>
              ))}
              <button className="btn">{t("save")}</button>
            </form>
          ) : (
            <SupportPanel bookings={bookings} />
          )}
        </section>
      </div>
    </main>
  );
}
function BookingRow({ b }: { b: Row }) {
  const { data, t } = useApp();
  const v = data.vehicles.find((x) => x.id === b.vehicleId);
  return (
    <div className="booking-row card">
      <img src={v?.image} alt={t("illustration")} />
      <div>
        <strong>{v?.name}</strong>
        <p>
          {b.id} · {b.pickupDate} — {b.returnDate}
        </p>
      </div>
      <Badge value={b.status} />
      <strong>{money(b.total)}</strong>
      <Link className="text-link" to={"/account/bookings/" + b.id}>
        {t("details")}
      </Link>
    </div>
  );
}

function SupportPanel({ bookings }: { bookings: Row[] }) {
  const { t, data, setRows, user, notify } = useApp();
  return (
    <>
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          setRows("tickets", [
            ...data.tickets,
            {
              id: "REQ-" + (data.tickets.length + 1),
              customerId: user,
              ...f,
              status: "pending",
            },
          ]);
          notify(t("success"));
          e.currentTarget.reset();
        }}
      >
        <h2>{t("support")}</h2>
        <Field label={t("bookingRef")}>
          <select name="bookingId">
            <option value="">{t("general")}</option>
            {bookings.map((b) => (
              <option key={b.id}>{b.id}</option>
            ))}
          </select>
        </Field>
        <Field label={t("message")}>
          <textarea name="message" required />
        </Field>
        <button className="btn">{t("send")}</button>
      </form>
      <div className="section">
        {data.tickets
          .filter((x) => x.customerId === user)
          .map((x) => (
            <div className="card" key={x.id}>
              <div className="row">
                <strong>
                  {x.id} · {x.bookingId}
                </strong>
                <Badge value={x.status} />
              </div>
              <p>{x.message}</p>
            </div>
          ))}
      </div>
    </>
  );
}
