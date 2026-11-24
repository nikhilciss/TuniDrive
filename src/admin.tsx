import { BookingEditor } from "./components/BookingEditor";
import { SimulatedGateway } from "./components/SimulatedGateway";
import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  ClipboardList,
  Users,
  MapPin,
  CreditCard,
  FileText,
  Wrench,
  BarChart3,
  Settings,
  Tags,
  Globe,
  Bell,
  Menu,
  Search,
  Plus,
  Pencil,
  Trash2,
  Download,
  Printer,
  ExternalLink,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useApp, money, Row, downloadCSV } from "./store";
import {
  Logo,
  Lang,
  PageTitle,
  Badge,
  Field,
  Modal,
  Pagination,
} from "./components/UI";
import { BookingDetails, Invoice } from "./booking";
const sections = [
  ["dashboard", LayoutDashboard],
  ["vehicles", Car],
  ["calendar", CalendarDays],
  ["bookings", ClipboardList],
  ["pricing", Tags],
  ["customers", Users],
  ["locations", MapPin],
  ["payments", CreditCard],
  ["invoices", FileText],
  ["maintenance", Wrench],
  ["reports", BarChart3],
  ["content", Globe],
  ["settings", Settings],
] as const;
const sectionKey = (s: string) => (s === "vehicles" ? "fleetManagement" : s);
export function Admin() {
  const { admin, t, setAdmin } = useApp();
  const { section = "dashboard", id } = useParams();
  const [open, setOpen] = useState(false),
    [bell, setBell] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc]);
  if (!admin) return <Navigate to="/wp-admin/login" replace />;
  return (
    <div className="admin-shell">
      <aside className={"admin-sidebar " + (open ? "open" : "")}>
        <Logo white />
        <div className="wp-label">
          <span className="wp-icon">W</span> WordPress{" "}
          <span>{t("demoShort")}</span>
        </div>
        <small className="sidebar-label">{t("rentalManager")}</small>
        <nav>
          {sections.map(([s, I]) => (
            <Link
              className={section === s ? "active" : ""}
              key={s}
              to={s === "dashboard" ? "/wp-admin" : "/wp-admin/" + s}
            >
              <I size={19} />
              {t(sectionKey(s))}
            </Link>
          ))}
        </nav>
        <Link className="visit-site" to="/">
          <ExternalLink size={17} />
          {t("visitSite")}
        </Link>
        <button className="logout" onClick={() => setAdmin(false)}>
          {t("logout")}
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <button
            className="menu-toggle"
            aria-label={t("menu")}
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </button>
          <div className="breadcrumbs">
            TuniDrive <span>/</span> {t(sectionKey(section))}
          </div>
          <div className="row-start">
            <Lang />
            <div className="notification-wrap">
              <button
                className="icon-button"
                aria-label={t("notifications")}
                onClick={() => setBell(!bell)}
              >
                <Bell size={20} />
                <span className="notification-dot" />
              </button>
              {bell && (
                <div className="notification-pop">
                  <strong>{t("notifications")}</strong>
                  <p>{t("noNotifications")}</p>
                  <Link to="/wp-admin/bookings">{t("bookings")}</Link>
                </div>
              )}
            </div>
            <span className="avatar coral">AD</span>
            <span className="admin-name">
              {t("demoAdmin")}
              <small>{t("admin")}</small>
            </span>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-demo">
            <span>{t("demo")}</span>
            <span>{t("demoNote")}</span>
          </div>
          {section === "dashboard" ? (
            <Dashboard />
          ) : section === "calendar" ? (
            <Availability />
          ) : section === "reports" ? (
            <Reports />
          ) : section === "settings" ? (
            <SettingsPage />
          ) : section === "content" ? (
            <ContentManager />
          ) : section === "bookings" && id && id !== "new" ? (
            <AdminBooking id={id} />
          ) : section === "invoices" && id ? (
            <Invoice />
          ) : (
            <EntityManager key={section} entity={section} id={id} />
          )}
        </div>
      </div>
    </div>
  );
}
function Dashboard() {
  const { data, t } = useApp();
  const paid = data.payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const active = data.vehicles.filter((v) => v.status === "rented").length;
  const stats = [
    ["fleet", data.vehicles.length],
    ["available", data.vehicles.filter((v) => v.status === "available").length],
    ["rented", active],
    [
      "maintenance",
      data.vehicles.filter((v) => v.status === "maintenance").length,
    ],
    ["bookings", data.bookings.length],
    ["pending", data.bookings.filter((b) => b.status === "pending").length],
    ["confirmed", data.bookings.filter((b) => b.status === "confirmed").length],
    ["revenue", money(paid)],
  ];
  return (
    <>
      <PageTitle title={t("dashboard")} sub={t("welcome") + " · 24/11/2026"}>
        <Link className="btn" to="/wp-admin/bookings/new">
          <Plus size={17} />
          {t("book")}
        </Link>
      </PageTitle>
      <div className="stats-grid">
        {stats.map(([k, v]) => (
          <div className="stat card" key={k}>
            <span>{t(String(k))}</span>
            <strong>{v}</strong>
            <small>TuniDrive · {t("demoAccess")}</small>
          </div>
        ))}
      </div>
      <Analytics />
      <div className="two-columns">
        <div className="card">
          <h3>{t("pickup")}</h3>
          {data.bookings
            .filter((b) => b.status === "confirmed")
            .slice(0, 4)
            .map((b) => (
              <div className="record-line" key={b.id}>
                <Link to={"/wp-admin/bookings/" + b.id}>{b.id}</Link>
                <span>{b.pickupDate}</span>
                <strong>
                  {data.vehicles.find((v) => v.id === b.vehicleId)?.name}
                </strong>
              </div>
            ))}
        </div>
        <div className="card">
          <h3>{t("returnDate")}</h3>
          {data.bookings
            .filter((b) => b.status === "active")
            .slice(0, 4)
            .map((b) => (
              <div className="record-line" key={b.id}>
                <Link to={"/wp-admin/bookings/" + b.id}>{b.id}</Link>
                <span>{b.returnDate}</span>
                <strong>
                  {data.vehicles.find((v) => v.id === b.vehicleId)?.name}
                </strong>
              </div>
            ))}
        </div>
      </div>
      <h2>{t("recentBookings")}</h2>
      <DataTable entity="bookings" rows={data.bookings.slice(0, 8)} />
      <div className="card">
        <h3>{t("customers")}</h3>
        <div className="record-line">
          {data.customers.slice(-4).map((c) => (
            <Link key={c.id} to={"/wp-admin/customers/" + c.id}>
              {c.name}
              <small>{c.joined}</small>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
function Analytics({ rows }: { rows?: Row[] }) {
  const { data, t } = useApp();
  const bookings = rows || data.bookings;
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: String(i + 1).padStart(2, "0"),
    revenue: bookings
      .filter(
        (b) =>
          Number(b.pickupDate.slice(5, 7)) === i + 1 &&
          b.status !== "cancelled",
      )
      .reduce((s, b) => s + b.total, 0),
    bookings: bookings.filter((b) => Number(b.pickupDate.slice(5, 7)) === i + 1)
      .length,
  }));
  const status = [
    "pending",
    "confirmed",
    "active",
    "completed",
    "cancelled",
  ].map((s) => ({
    name: t(s),
    value: bookings.filter((b) => b.status === s).length,
  }));
  const colors = ["#efac4d", "#2776ab", "#3a9a8b", "#132e49", "#e56e57"];
  const cats = data.categories.map((c) => ({
    name: t(c.id),
    bookings: bookings.filter(
      (b) => data.vehicles.find((v) => v.id === b.vehicleId)?.category === c.id,
    ).length,
  }));
  const locs = data.locations.map((l) => ({
    name: t(l.city),
    revenue: bookings
      .filter((b) => b.pickupLocation === l.id && b.status !== "cancelled")
      .reduce((s, b) => s + b.total, 0),
  }));
  return (
    <>
      <div className="analytics-grid">
        <div className="card chart">
          <h3>{t("monthlyRevenue")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={months}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2580ad" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2580ad" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e8edf2" />
              <XAxis dataKey="name" />
              <YAxis width={65} />
              <Tooltip formatter={(v: any) => money(Number(v))} />
              <Area
                isAnimationActive={false}
                dataKey="revenue"
                name={t("revenue")}
                stroke="#2580ad"
                fill="url(#areaFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart">
          <h3>
            {t("status")} · {t("bookings")}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                isAnimationActive={false}
                data={status}
                dataKey="value"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
              >
                {status.map((_, i) => (
                  <Cell fill={colors[i]} key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {status.map((s, i) => (
              <span key={s.name}>
                <i style={{ background: colors[i] }} />
                {s.name} {s.value}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="two-columns">
        <div className="card chart">
          <h3>{t("bookings")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                isAnimationActive={false}
                dataKey="bookings"
                name={t("bookings")}
                fill="#ed6b51"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart">
          <h3>{t("category")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cats}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                isAnimationActive={false}
                dataKey="bookings"
                name={t("bookings")}
                fill="#2776ab"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="two-columns">
        <div className="card">
          <h3>{t("utilization")}</h3>
          <strong className="big-number">
            {Math.round(
              (data.vehicles.filter((v) => v.status === "rented").length /
                data.vehicles.length) *
                100,
            )}
            %
          </strong>
          {["available", "rented", "maintenance"].map((s) => (
            <div key={s} className="utilization">
              <div className="row">
                <span>{t(s)}</span>
                <span>
                  {data.vehicles.filter((v) => v.status === s).length}
                </span>
              </div>
              <progress
                max={data.vehicles.length}
                value={data.vehicles.filter((v) => v.status === s).length}
              />
            </div>
          ))}
        </div>
        <div className="card chart">
          <h3>
            {t("revenue")} · {t("locations")}
          </h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={locs}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={65} />
              <Tooltip formatter={(v: any) => money(Number(v))} />
              <Bar
                isAnimationActive={false}
                dataKey="revenue"
                name={t("revenue")}
                fill="#3a9a8b"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
const columns: Record<string, string[]> = {
  vehicles: ["name", "category", "price", "status"],
  bookings: ["id", "customerId", "vehicleId", "pickupDate", "total", "status"],
  customers: ["name", "email", "country", "status"],
  locations: ["name", "city", "hours", "airport"],
  payments: ["id", "bookingId", "amount", "method", "status"],
  invoices: ["id", "bookingId", "total", "date", "status"],
  maintenance: ["id", "vehicleId", "type", "start", "cost", "status"],
  pricing: ["name", "adjustment", "start", "end"],
  categories: ["name", "description"],
  offers: ["code", "titleKey", "discount", "end"],
  banners: ["titleKey", "descriptionKey", "link"],
  testimonials: ["name", "city", "rating", "textKey"],
  faqs: ["questionKey", "answerKey"],
  content: ["title", "status"],
  extras: ["name", "price"],
  blog: ["title", "body", "status", "image"],
  menus: ["title", "link", "status"],
  footer: ["title", "link", "status"],
  contact: ["name", "email", "phone", "address"],
  seo: ["title", "description", "status"],
};
function DataTable({
  entity,
  rows,
  onEdit,
  onDelete,
}: {
  entity: string;
  rows: Row[];
  onEdit?: (r: Row) => void;
  onDelete?: (r: Row) => void;
}) {
  const { t, data } = useApp();
  const cols = columns[entity] || Object.keys(rows[0] || {}).slice(0, 5);
  const display = (r: Row, k: string) => {
    const v = r[k];
    if (k === "status") return <Badge value={v} />;
    if (k === "method" || k === "paymentMethod")
      return t(
        v === "pickup" ? "pickupPayment" : v === "card" ? "demoGateway" : v,
      );
    if (["price", "amount", "total", "cost"].includes(k)) return money(v);
    if (k === "customerId")
      return (
        <Link to={"/wp-admin/customers/" + v}>
          {data.customers.find((c) => c.id === v)?.name}
        </Link>
      );
    if (k === "vehicleId")
      return (
        <Link to={"/wp-admin/vehicles/" + v}>
          {data.vehicles.find((c) => c.id === v)?.name}
        </Link>
      );
    if (k === "bookingId")
      return <Link to={"/wp-admin/bookings/" + v}>{v}</Link>;
    if (k === "name" && entity === "vehicles")
      return (
        <span className="table-vehicle">
          <img src={r.image} alt="" />
          {v}
        </span>
      );
    return typeof v === "boolean" ? (v ? "✓" : "—") : t(String(v ?? "—"));
  };
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>
                {t(
                  c === "vehicleId"
                    ? "vehicle"
                    : c === "customerId"
                      ? "customer"
                      : c,
                )}
              </th>
            ))}
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {cols.map((c) => (
                <td key={c}>{display(r, c)}</td>
              ))}
              <td>
                <div className="table-actions">
                  {onEdit ? (
                    <button
                      className="icon-button"
                      title={t("edit")}
                      onClick={() => onEdit(r)}
                    >
                      <Pencil size={16} />
                    </button>
                  ) : (
                    <Link
                      className="text-link"
                      to={"/wp-admin/" + entity + "/" + r.id}
                    >
                      {t("view")}
                    </Link>
                  )}
                  {onDelete && (
                    <button
                      className="icon-button danger"
                      title={t("delete")}
                      onClick={() => onDelete(r)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <div className="empty">{t("empty")}</div>}
    </div>
  );
}
function EntityManager({ entity, id }: { entity: string; id?: string }) {
  const { data, t, setRows, notify, saveBooking, generateInvoice } = useApp();
  const nav = useNavigate();
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [page, setPage] = useState(1),
    [editing, setEditing] = useState<Row | null>(null),
    [deleting, setDeleting] = useState<Row | null>(null);
  const [tab, setTab] = useState(entity);
  const actual =
    entity === "vehicles" && tab === "categories"
      ? "categories"
      : entity === "pricing" && tab === "offers"
        ? "offers"
        : entity === "pricing" && tab === "vehicles"
          ? "vehicles"
          : entity;
  const all = data[actual] || [];
  const row = id && id !== "new" ? all.find((x) => x.id === id) : null;
  useEffect(() => {
    if (id === "new") setEditing({});
  }, [id]);
  const filtered = all.filter(
    (r) =>
      JSON.stringify(r).toLowerCase().includes(query.toLowerCase()) &&
      (status === "all" || r.status === status || r.paymentStatus === status),
  );
  useEffect(() => setPage(1), [query, status, tab]);
  const save = (values: Row) => {
    const newRow = {
      ...values,
      id: editing?.id || actual.slice(0, 2).toUpperCase() + "-" + Date.now(),
    };
    if (actual === "bookings") {
      const id = saveBooking({ ...values, id: editing?.id });
      setEditing(null);
      notify(t("success"));
      nav("/wp-admin/bookings/" + id);
      return;
    }
    if (actual === "invoices" && !editing?.id) {
      const invoiceId = generateInvoice(values.bookingId);
      setEditing(null);
      notify(t("success"));
      nav("/wp-admin/invoices/" + invoiceId);
      return;
    }
    setRows(
      actual,
      editing?.id
        ? all.map((r) => (r.id === editing.id ? newRow : r))
        : [...all, newRow],
    );
    setEditing(null);
    notify(t("success"));
    if (id === "new") nav("/wp-admin/" + entity);
  };
  return (
    <>
      <PageTitle title={t(sectionKey(entity))} sub={t("demoNote")}>
        <div className="button-row">
          <button
            className="btn outline small"
            onClick={() => downloadCSV(filtered, entity)}
          >
            <Download size={16} />
            {t("export")}
          </button>
          <button className="btn small" onClick={() => setEditing({})}>
            <Plus size={16} />
            {t("add")}
          </button>
        </div>
      </PageTitle>
      {entity === "vehicles" && (
        <div className="tabs">
          {["vehicles", "categories"].map((k) => (
            <button
              className={tab === k ? "active" : ""}
              onClick={() => setTab(k)}
              key={k}
            >
              {t(
                k === "vehicles"
                  ? "fleet"
                  : k === "categories"
                    ? "category"
                    : k,
              )}
            </button>
          ))}
          <Link to="/wp-admin/calendar">{t("calendar")}</Link>
        </div>
      )}
      {entity === "pricing" && (
        <div className="tabs">
          {["vehicles", "pricing", "offers"].map((k) => (
            <button
              key={k}
              className={tab === k ? "active" : ""}
              onClick={() => setTab(k)}
            >
              {t(k === "vehicles" ? "standardRates" : k)}
            </button>
          ))}
        </div>
      )}
      {entity === "payments" && (
        <div className="stats-grid">
          {["paid", "pending", "refunded"].map((s) => (
            <div className="card stat" key={s}>
              <span>{t(s)}</span>
              <strong>
                {money(
                  all
                    .filter((x) => x.status === s)
                    .reduce((n, x) => n + x.amount, 0),
                )}
              </strong>
            </div>
          ))}
        </div>
      )}
      {row ? (
        <>
          <div className="card">
            <div className="row">
              <h2>{row.name || row.id}</h2>
              <button className="btn" onClick={() => setEditing(row)}>
                {t("edit")}
              </button>
            </div>
            {row.image && (
              <img
                className="record-image"
                src={row.image}
                alt={t("illustration")}
              />
            )}
            <div className="spec-grid">
              {Object.entries(row)
                .filter(
                  ([k]) => !["image", "features", "locations"].includes(k),
                )
                .map(([k, v]) => (
                  <div key={k}>
                    <small>{t(k)}</small>
                    <strong>
                      {Array.isArray(v)
                        ? v.map((x) => t(x)).join(", ")
                        : t(String(v))}
                    </strong>
                  </div>
                ))}
            </div>
          </div>
          {["customers", "vehicles", "locations"].includes(entity) && (
            <>
              <h2>{t("bookings")}</h2>
              <DataTable
                entity="bookings"
                rows={data.bookings.filter((b) =>
                  entity === "customers"
                    ? b.customerId === id
                    : entity === "vehicles"
                      ? b.vehicleId === id
                      : b.pickupLocation === id,
                )}
              />
              {entity === "customers" && (
                <>
                  <h2>{t("payments")}</h2>
                  <DataTable
                    entity="payments"
                    rows={data.payments.filter((p) => p.customerId === id)}
                  />
                </>
              )}
              {entity === "locations" && (
                <>
                  <h2>{t("fleet")}</h2>
                  <DataTable
                    entity="vehicles"
                    rows={data.vehicles.filter((v) => v.locations.includes(id))}
                  />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="table-toolbar">
            <label className="search-input">
              <Search size={18} />
              <input
                aria-label={t("searchRecords")}
                placeholder={t("searchRecords")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label={t("status")}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">{t("all")}</option>
              {[...new Set(all.map((r) => r.status).filter(Boolean))].map(
                (s) => (
                  <option key={s} value={s}>
                    {t(s)}
                  </option>
                ),
              )}
            </select>
            <span>
              {filtered.length} / {all.length}
            </span>
          </div>
          <DataTable
            entity={actual}
            rows={filtered.slice((page - 1) * 8, page * 8)}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
          <Pagination page={page} setPage={setPage} total={filtered.length} />
          <div className="record-links">
            {filtered.slice((page - 1) * 8, page * 8).map((r) => (
              <Link
                className="text-link"
                key={r.id}
                to={"/wp-admin/" + actual + "/" + r.id}
              >
                {t("view")}: {r.name || r.id}
              </Link>
            ))}
          </div>
        </>
      )}
      {editing && (
        <Modal
          title={t(editing.id ? "edit" : "add") + " · " + t(sectionKey(actual))}
          onClose={() => {
            setEditing(null);
            if (id === "new") nav("/wp-admin/" + entity);
          }}
        >
          <EntityForm entity={actual} row={editing} onSave={save} />
        </Modal>
      )}
      {deleting && (
        <Modal
          title={t("delete") + " · " + (deleting.name || deleting.id)}
          onClose={() => setDeleting(null)}
        >
          <p>{t("demoNote")}</p>
          <button
            className="btn"
            onClick={() => {
              const referenced =
                (actual === "bookings" &&
                  (data.invoices.some((x) => x.bookingId === deleting.id) ||
                    data.payments.some((x) => x.bookingId === deleting.id))) ||
                (["vehicles", "customers", "locations"].includes(actual) &&
                  data.bookings.some(
                    (b) =>
                      b.vehicleId === deleting.id ||
                      b.customerId === deleting.id ||
                      b.pickupLocation === deleting.id ||
                      b.returnLocation === deleting.id,
                  ));
              if (referenced) {
                notify(t("deleteReferenced"));
                setDeleting(null);
                return;
              }
              setRows(
                actual,
                all.filter((r) => r.id !== deleting.id),
              );
              setDeleting(null);
              notify(t("success"));
            }}
          >
            {t("delete")}
          </button>
        </Modal>
      )}
    </>
  );
}
const fields: Record<string, string[]> = {
  vehicles: [
    "name",
    "manufacturer",
    "model",
    "registration",
    "year",
    "category",
    "transmission",
    "fuel",
    "passengers",
    "doors",
    "luggage",
    "price",
    "status",
    "locations",
    "image",
    "deposit",
    "mileage",
  ],
  customers: ["name", "email", "phone", "country", "status"],
  locations: [
    "name",
    "city",
    "address",
    "phone",
    "email",
    "hours",
    "airport",
    "image",
    "categories",
  ],
  bookings: [
    "customerId",
    "vehicleId",
    "pickupLocation",
    "returnLocation",
    "pickupDate",
    "returnDate",
    "pickupTime",
    "returnTime",
    "status",
    "paymentMethod",
  ],
  payments: ["bookingId", "amount", "method", "status", "date"],
  invoices: ["bookingId", "date", "status"],
  maintenance: ["vehicleId", "type", "start", "end", "cost", "status", "notes"],
  pricing: ["name", "adjustment", "start", "end"],
  categories: ["name", "description"],
  offers: ["code", "titleKey", "discount", "end", "image"],
  banners: ["titleKey", "descriptionKey", "image", "link", "position"],
  testimonials: ["name", "city", "rating", "textKey"],
  faqs: ["questionKey", "answerKey"],
  content: ["title", "status", "body"],
  extras: ["name", "price"],
  blog: ["title", "body", "status", "image"],
  menus: ["title", "link", "status"],
  footer: ["title", "link", "status"],
  contact: ["name", "email", "phone", "address"],
  seo: ["title", "description", "status"],
};
function EntityForm({
  entity,
  row,
  onSave,
}: {
  entity: string;
  row: Row;
  onSave: (r: Row) => void;
}) {
  if (entity === "bookings") return <BookingEditor row={row} onSave={onSave} />;
  return <StandardEntityForm entity={entity} row={row} onSave={onSave} />;
}
function StandardEntityForm({
  entity,
  row,
  onSave,
}: {
  entity: string;
  row: Row;
  onSave: (r: Row) => void;
}) {
  const { t, data } = useApp();
  const defaults: Record<string, Row> = {
    vehicles: {
      ...data.vehicles[0],
      id: undefined,
      name: "Demo vehicle",
      image: "/assets/vehicle-1.svg",
    },
    bookings: { ...data.bookings[0], id: undefined, status: "pending" },
    customers: { ...data.customers[0], id: undefined, name: "Client Démo" },
    locations: { ...data.locations[0], id: undefined, name: "Agence Démo" },
    maintenance: { ...data.maintenance[0], id: undefined },
    payments: { ...data.payments[0], id: undefined },
    invoices: { ...data.invoices[0], id: undefined },
  };
  const [value, setValue] = useState<Row>({
    ...data[entity]?.[0],
    ...defaults[entity],
    ...row,
    id: row.id,
  });
  const opts: Record<string, string[]> = {
    category: data.categories.map((x) => x.id),
    transmission: ["manual", "automatic"],
    fuel: ["petrol", "diesel"],
    status:
      entity === "vehicles"
        ? ["available", "rented", "maintenance"]
        : entity === "bookings"
          ? ["pending", "confirmed", "active", "completed", "cancelled"]
          : entity === "payments" || entity === "invoices"
            ? ["paid", "pending", "refunded"]
            : ["active", "scheduled", "completed", "published", "draft"],
    type: [
      "oil",
      "tyres",
      "inspection",
      "service",
      "cleaning",
      "insurance",
      "technical",
    ],
    paymentMethod: ["pickup", "card", "cash", "transfer"],
    method: ["pickup", "card", "cash", "transfer"],
    vehicleId: data.vehicles.map((x) => x.id),
    customerId: data.customers.map((x) => x.id),
    bookingId: data.bookings.map((x) => x.id),
    pickupLocation: data.locations.map((x) => x.id),
    returnLocation: data.locations.map((x) => x.id),
  };
  const numeric = [
    "price",
    "year",
    "passengers",
    "doors",
    "luggage",
    "deposit",
    "mileage",
    "amount",
    "total",
    "subtotal",
    "tax",
    "cost",
    "adjustment",
    "discount",
    "rating",
  ];
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = { ...value };
        if (["payments", "invoices"].includes(entity)) {
          const b = data.bookings.find((x) => x.id === v.bookingId)!;
          v.customerId = b.customerId;
          if (entity === "invoices") {
            v.subtotal = b.subtotal;
            v.tax = b.tax;
            v.total = b.total;
          }
        }
        onSave(v);
      }}
    >
      <div className="form-grid">
        {(fields[entity] || ["name", "status"]).map((k) => (
          <Field key={k} label={t(k)}>
            {opts[k] ? (
              <select
                value={value[k] || opts[k][0]}
                onChange={(e) => setValue({ ...value, [k]: e.target.value })}
              >
                {opts[k].map((o) => (
                  <option key={o} value={o}>
                    {data.vehicles.find((x) => x.id === o)?.name ||
                      data.customers.find((x) => x.id === o)?.name ||
                      t(data.locations.find((x) => x.id === o)?.name || "") ||
                      t(o)}
                  </option>
                ))}
              </select>
            ) : ["locations", "categories"].includes(k) ? (
              <select
                multiple
                value={value[k] || []}
                onChange={(e) =>
                  setValue({
                    ...value,
                    [k]: Array.from(e.target.selectedOptions, (o) => o.value),
                  })
                }
              >
                {data[k].map((x) => (
                  <option key={x.id} value={x.id}>
                    {t(x.name)}
                  </option>
                ))}
              </select>
            ) : k === "airport" ? (
              <input
                type="checkbox"
                checked={Boolean(value[k])}
                onChange={(e) => setValue({ ...value, [k]: e.target.checked })}
              />
            ) : [
                "notes",
                "body",
                "descriptionKey",
                "answerKey",
                "textKey",
              ].includes(k) ? (
              <textarea
                value={value[k] || ""}
                onChange={(e) => setValue({ ...value, [k]: e.target.value })}
              />
            ) : (
              <input
                required={k !== "notes"}
                type={
                  numeric.includes(k)
                    ? "number"
                    : /Date$|^start$|^end$|^date$/.test(k)
                      ? "date"
                      : /Time$/.test(k)
                        ? "time"
                        : k === "email"
                          ? "email"
                          : "text"
                }
                min={numeric.includes(k) && k !== "adjustment" ? 0 : undefined}
                step={numeric.includes(k) ? "any" : undefined}
                value={value[k] ?? ""}
                onChange={(e) =>
                  setValue({
                    ...value,
                    [k]: numeric.includes(k)
                      ? Number(e.target.value)
                      : e.target.value,
                  })
                }
              />
            )}
          </Field>
        ))}
      </div>
      <div className="notice">{t("demoNote")}</div>
      <button className="btn" type="submit">
        {t("save")}
      </button>
    </form>
  );
}
function AdminBooking({ id }: { id: string }) {
  const { data, t, saveBooking, generateInvoice, notify } = useApp();
  const nav = useNavigate();
  const [editing, setEditing] = useState(false),
    [gateway, setGateway] = useState(false),
    [error, setError] = useState("");
  const b = data.bookings.find((x) => x.id === id);
  if (!b) return <p>{t("notFound")}</p>;
  const update = (patch: Row) => {
    try {
      saveBooking({ ...b, ...patch });
      notify(t("success"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <div className="button-row no-print">
        <button className="btn outline small" onClick={() => setEditing(true)}>
          {t("edit")}
        </button>
        {[
          ["confirmed", "confirm"],
          ["cancelled", "cancel"],
          ["active", "collect"],
          ["completed", "complete"],
        ].map(([status, key]) => (
          <button
            key={status}
            className="btn outline small"
            disabled={b.status === status}
            onClick={() => update({ status })}
          >
            {t(key)}
          </button>
        ))}
        <button
          className="btn outline small"
          onClick={() => nav("/wp-admin/invoices/" + generateInvoice(id))}
        >
          {t(
            data.invoices.some((i) => i.bookingId === id)
              ? "invoice"
              : "generateInvoice",
          )}
        </button>
        {b.status !== "cancelled" &&
          b.paymentStatus === "pending" &&
          ["card", "pickup"].includes(b.paymentMethod) && (
            <button
              className="btn outline small"
              onClick={() =>
                b.paymentMethod === "card"
                  ? setGateway(true)
                  : update({ pickupPaid: true })
              }
            >
              {t(
                b.paymentMethod === "card"
                  ? "payOnline"
                  : "recordPickupPayment",
              )}
            </button>
          )}
        <Link
          className="btn outline small"
          to={"/wp-admin/customers/" + b.customerId}
        >
          {t("customer")}
        </Link>
      </div>
      {error && (
        <p className="error" role="alert">
          {t(error)}
        </p>
      )}
      <BookingDetails />
      {editing && (
        <Modal
          title={t("edit") + " · " + b.id}
          onClose={() => setEditing(false)}
        >
          <BookingEditor
            row={b}
            onSave={(values) => {
              update(values);
              setEditing(false);
            }}
          />
        </Modal>
      )}
      {gateway && (
        <SimulatedGateway
          amount={b.total}
          onCancel={() => setGateway(false)}
          onApproved={(reference) => {
            update({ gatewayApproved: true, gatewayReference: reference });
            setGateway(false);
          }}
        />
      )}
    </>
  );
}
function Availability() {
  const { data, t } = useApp();
  const [view, setView] = useState("week"),
    [date, setDate] = useState("2026-11-24"),
    [selected, setSelected] = useState<Row | null>(null);
  const count =
    view === "day"
      ? 1
      : view === "week"
        ? 7
        : new Date(
            Number(date.slice(0, 4)),
            Number(date.slice(5, 7)),
            0,
          ).getDate();
  const dates = Array.from({ length: count }, (_, i) => {
    const d = new Date(date + "T12:00:00");
    if (view === "month") d.setDate(1);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  return (
    <>
      <PageTitle title={t("calendar")} sub={t("demoNote")} />
      <div className="table-toolbar">
        <input
          aria-label={t("date")}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="tabs">
          {["day", "week", "month"].map((v) => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              onClick={() => setView(v)}
            >
              {t(v)}
            </button>
          ))}
        </div>
        <div className="legend">
          {["available", "confirmed", "pending", "maintenance"].map((s) => (
            <Badge key={s} value={s} />
          ))}
        </div>
      </div>
      <div className="table-wrap calendar-table">
        <table>
          <thead>
            <tr>
              <th>{t("vehicle")}</th>
              {dates.map((d) => (
                <th key={d}>
                  {d.slice(8)} / {d.slice(5, 7)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.vehicles.map((v) => (
              <tr key={v.id}>
                <td>
                  <strong>{v.name}</strong>
                </td>
                {dates.map((day) => {
                  const b = data.bookings.find(
                    (b) =>
                      b.vehicleId === v.id &&
                      b.pickupDate <= day &&
                      b.returnDate > day &&
                      b.status !== "cancelled",
                  );
                  const m = data.maintenance.find(
                    (m) =>
                      m.vehicleId === v.id && m.start <= day && m.end >= day,
                  );
                  return (
                    <td key={day}>
                      <button
                        aria-label={`${v.name} ${day} ${t(m ? "maintenance" : b ? b.status : "available")}`}
                        className={
                          "calendar-cell " +
                          (m ? "maintenance" : b ? b.status : "available")
                        }
                        onClick={() =>
                          setSelected(
                            m
                              ? { ...m, kind: "maintenance" }
                              : b
                                ? { ...b, kind: "bookings" }
                                : {
                                    id: v.name,
                                    status: "available",
                                    date: day,
                                  },
                          )
                        }
                      >
                        {m ? t("maintenance") : b ? b.id : "✓"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <Modal title={selected.id} onClose={() => setSelected(null)}>
          <p>
            {selected.pickupDate || selected.start || selected.date} —{" "}
            {selected.returnDate || selected.end}
          </p>
          <Badge value={selected.status} />
          {selected.kind && (
            <p>
              <Link
                className="btn"
                to={"/wp-admin/" + selected.kind + "/" + selected.id}
              >
                {t("details")}
              </Link>
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
function Reports() {
  const { t, data } = useApp();
  const [report, setReport] = useState("bookings"),
    [from, setFrom] = useState("2026-01-01"),
    [to, setTo] = useState("2026-12-31"),
    [location, setLocation] = useState("all");
  const bookings = data.bookings.filter(
    (b) =>
      b.pickupDate >= from &&
      b.pickupDate <= to &&
      (location === "all" || b.pickupLocation === location),
  );
  const summarize = (name: string, selected: Row[]) => ({
    name,
    bookings: selected.length,
    days: selected
      .filter((b) => b.status !== "cancelled")
      .reduce((n, b) => n + b.days, 0),
    revenue: selected
      .filter((b) => b.status !== "cancelled")
      .reduce((n, b) => n + b.total, 0),
  });
  const summary =
    report === "locations"
      ? data.locations
          .filter((l) => location === "all" || l.id === location)
          .map((l) =>
            summarize(
              t(l.name),
              bookings.filter((b) => b.pickupLocation === l.id),
            ),
          )
      : report === "utilization" || report === "vehicles"
        ? data.vehicles.map((v) =>
            summarize(
              v.name,
              bookings.filter((b) => b.vehicleId === v.id),
            ),
          )
        : report === "revenue" || report === "seasonal"
          ? Array.from({ length: 12 }, (_, i) =>
              summarize(
                String(i + 1).padStart(2, "0") + "/2026",
                bookings.filter(
                  (b) => Number(b.pickupDate.slice(5, 7)) === i + 1,
                ),
              ),
            )
          : null;
  const rows =
    summary ||
    (report === "maintenance"
      ? data.maintenance.filter(
          (m) =>
            m.start >= from &&
            m.start <= to &&
            (location === "all" ||
              data.vehicles
                .find((v) => v.id === m.vehicleId)
                ?.locations.includes(location)),
        )
      : report === "customers"
        ? data.customers.filter((c) =>
            bookings.some((b) => b.customerId === c.id),
          )
        : bookings);
  const entity = ["maintenance", "customers"].includes(report)
    ? report
    : "bookings";
  return (
    <>
      <PageTitle title={t("reports")}>
        <div className="button-row">
          <button className="btn outline" onClick={() => window.print()}>
            <Printer size={17} />
            {t("print")}
          </button>
          <button
            className="btn"
            onClick={() => downloadCSV(rows, "tunidrive-" + report)}
          >
            <Download size={17} />
            {t("export")}
          </button>
        </div>
      </PageTitle>
      <div className="card report-filters">
        <Field label={t("reports")}>
          <select value={report} onChange={(e) => setReport(e.target.value)}>
            {[
              "bookings",
              "revenue",
              "utilization",
              "vehicles",
              "customers",
              "locations",
              "seasonal",
              "maintenance",
            ].map((k) => (
              <option key={k} value={k}>
                {t(k)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("pickupDate")}>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </Field>
        <Field label={t("returnDate")}>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Field>
        <Field label={t("locations")}>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="all">{t("all")}</option>
            {data.locations.map((l) => (
              <option key={l.id} value={l.id}>
                {t(l.name)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="stats-grid">
        <div className="card stat">
          <span>{t("bookings")}</span>
          <strong>{bookings.length}</strong>
        </div>
        <div className="card stat">
          <span>{t("revenue")}</span>
          <strong>
            {money(
              bookings
                .filter((b) => b.status !== "cancelled")
                .reduce((s, b) => s + b.total, 0),
            )}
          </strong>
        </div>
      </div>
      <Analytics rows={bookings} />
      {summary ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {["name", "bookings", "days", "revenue"].map((k) => (
                  <th key={k}>{t(k)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.bookings}</td>
                  <td>{r.days}</td>
                  <td>{money(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <DataTable entity={entity} rows={rows} />
      )}
    </>
  );
}
const cmsTabs = [
  "content",
  "banners",
  "media",
  "testimonials",
  "faqs",
  "blog",
  "offers",
  "menus",
  "footer",
  "contact",
  "seo",
];
function ContentManager() {
  const { t, data, setRows, notify } = useApp();
  const [tab, setTab] = useState("content"),
    [editing, setEditing] = useState<Row | null>(null);
  const entity = tab;
  return (
    <>
      <PageTitle title={t("content")} sub={t("demoNote")} />
      <div className="tabs wrap">
        {cmsTabs.map((k) => (
          <button
            key={k}
            className={tab === k ? "active" : ""}
            onClick={() => setTab(k)}
          >
            {t(k)}
          </button>
        ))}
      </div>
      {tab === "media" ? (
        <div className="media-grid">
          {[
            ...new Set([
              "/assets/hero.webp",
              "/assets/luxury.webp",
              ...data.vehicles.map((v) => v.image),
              ...data.locations.map((l) => l.image),
            ]),
          ].map((src) => (
            <div className="card" key={src}>
              <img src={src} alt={t("illustration")} />
              <small>{src}</small>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="row">
            <h2>{t(tab)}</h2>
            <div className="button-row">
              <Link
                className="btn outline small"
                to={
                  tab === "banners"
                    ? "/"
                    : tab === "offers"
                      ? "/offers"
                      : tab === "faqs"
                        ? "/faq"
                        : "/about"
                }
                target="_blank"
              >
                {t("preview")}
              </Link>
              <button className="btn small" onClick={() => setEditing({})}>
                {t("add")}
              </button>
            </div>
          </div>
          <DataTable
            entity={entity}
            rows={data[entity] || []}
            onEdit={setEditing}
          />
        </>
      )}
      {editing && (
        <Modal
          title={t("edit") + " · " + t(tab)}
          onClose={() => setEditing(null)}
        >
          <EntityForm
            entity={entity}
            row={editing}
            onSave={(r) => {
              const rows = data[entity] || [];
              setRows(
                entity,
                editing.id
                  ? rows.map((x) => (x.id === editing.id ? r : x))
                  : [...rows, { ...r, id: "CMS-" + Date.now() }],
              );
              setEditing(null);
              notify(t("success"));
            }}
          />
        </Modal>
      )}
    </>
  );
}
const settingGroups = [
  "general",
  "company",
  "bookingPlugin",
  "currency",
  "languages",
  "durationRules",
  "cancellation",
  "insurance",
  "extras",
  "gateways",
  "emailNotifications",
  "whatsappNotifications",
  "users",
  "roles",
  "security",
];
function SettingsPage() {
  const { t, notify, data, setRows, lang } = useApp();
  const [tab, setTab] = useState("general");
  const [values, setValues] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const config: Record<string, Record<string, string>> = {
    general: {
      name: "TuniDrive",
      tagline: "Your Journey Starts Here",
      timezone: "Africa/Tunis",
    },
    company: {
      name: "TuniDrive Demo",
      address: "Tunis, Tunisie (demo)",
      email: "contact@tunidrive.demo",
      phone: "+216 XX XXX XXX",
    },
    bookingPlugin: {
      minimumAge: "21",
      licenceYears: "2",
      minimumDays: "1",
      maximumDays: "90",
    },
    currency: { currency: "TND", decimals: "2" },
    languages: { defaultLanguage: "en", languages: "fr, en, ar", rtl: "ar" },
    durationRules: { minimumDays: "1", maximumDays: "90", graceMinutes: "60" },
    cancellation: { freeCancellationHours: "48", lateFeeDays: "1" },
    insurance: {
      basicDeposit: "500",
      premiumDeposit: "200",
      premiumPrice: "30",
    },
    gateways: {
      mode: "DEMO",
      pickupPayment: "Enabled",
      card: "Simulated only",
    },
    emailNotifications: {
      sender: "noreply@tunidrive.demo",
      mode: "Simulation",
      bookingConfirmation: "Enabled",
    },
    whatsappNotifications: {
      mode: "Simulation",
      template: "TuniDrive demo confirmation",
    },
    users: {
      name: "Admin Démo",
      email: "admin@tunidrive.demo",
      role: "Administrator",
    },
    roles: {
      administrator: "All demo screens",
      manager: "Fleet and bookings",
      customer: "Own sample reservations",
    },
    security: {
      mode: "Frontend demonstration",
      authentication: "Simulated",
      persistence: "None",
    },
  };
  return (
    <>
      <PageTitle title={t("settings")} sub={t("demoNote")} />
      <div className="settings-layout">
        <aside className="settings-nav">
          {settingGroups.map((k) => (
            <button
              className={tab === k ? "active" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              {t(k)}
            </button>
          ))}
        </aside>
        {tab === "extras" ? (
          <div className="card">
            <h2>{t("extras")}</h2>
            {data.extras.map((e) => (
              <Field key={e.id} label={t(e.id) + " · TND"}>
                <input
                  type="number"
                  min="0"
                  value={e.price}
                  onChange={(event) =>
                    setRows(
                      "extras",
                      data.extras.map((x) =>
                        x.id === e.id
                          ? { ...x, price: Number(event.target.value) }
                          : x,
                      ),
                    )
                  }
                />
              </Field>
            ))}
            <button className="btn" onClick={() => notify(t("success"))}>
              {t("save")}
            </button>
          </div>
        ) : (
          <form
            className="card"
            key={tab + lang}
            onSubmit={(e) => {
              e.preventDefault();
              setValues({
                ...values,
                [tab]: Object.fromEntries(
                  new FormData(e.currentTarget),
                ) as Record<string, string>,
              });
              notify(t("success"));
            }}
          >
            <h2>{t(tab)}</h2>
            {Object.entries(values[tab] || config[tab] || {}).map(([k, v]) => (
              <Field label={t(k)} key={k}>
                <input name={k} defaultValue={t(v)} required />
              </Field>
            ))}
            <div className="notice">{t("demoNote")}</div>
            <button className="btn">{t("save")}</button>
          </form>
        )}
      </div>
    </>
  );
}
