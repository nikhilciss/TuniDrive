import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Users,
  Briefcase,
  Gauge,
  Heart,
  MapPin,
  Menu,
  X,
  Globe,
  ShieldCheck,
  Headphones,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApp, money, Row } from "../store";
export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export function Lang() {
  const { lang, setLang, t } = useApp();
  return (
    <label className="lang">
      <Globe size={16} />
      <select
        aria-label={t("language")}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
}
export function Logo({ white = false }: { white?: boolean }) {
  return (
    <Link to="/" className="logo">
      <img src={`/assets/logo${white ? "-white" : ""}.svg`} alt="TuniDrive" />
    </Link>
  );
}
export function Header() {
  const { t, data } = useApp();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc]);
  return (
    <>
      <div className="topline">
        <span>
          <MapPin size={13} /> {t("localExpertise")}
        </span>
        <Link to="/demo-access">
          {t("demoAccess")} <span>·</span> {t("demo")}
        </Link>
      </div>
      <header className="header">
        <Logo />
        <button
          className="menu-toggle"
          aria-label={t("menu")}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "open" : ""}>
          {data.menus
            .filter((m) => m.status === "published")
            .map((m) => (
              <Link
                className={loc.pathname === m.link ? "active" : ""}
                key={m.id}
                to={m.link}
              >
                {t(m.title)}
              </Link>
            ))}
        </nav>
        <div className="header-actions">
          <Lang />
          <Link className="account-link" to="/account">
            {t("account")}
          </Link>
          <Link className="btn small" to="/fleet">
            {t("book")}
          </Link>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  const { t, data } = useApp();
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo white />
          <p>{t("eyebrow")}</p>
          <p className="muted">{t("locationText")}</p>
          <div className="social">
            TN <span>·</span> FR <span>·</span> EN <span>·</span> AR
          </div>
        </div>
        <div>
          <h4>TuniDrive</h4>
          {["about", "fleet", "locations", "offers", "contact"].map((k) => (
            <Link key={k} to={"/" + k}>
              {t(k)}
            </Link>
          ))}
        </div>
        <div>
          <h4>{t("rental")}</h4>
          {["airport", "long-term", "requirements", "insurance", "faq"].map(
            (k) => (
              <Link key={k} to={"/" + k}>
                {t(k)}
              </Link>
            ),
          )}
        </div>
        <div>
          <h4>{t("account")}</h4>
          {["account", "login", "demo-access", "wp-admin"].map((k, i) => (
            <Link key={k} to={"/" + k}>
              {t(["customerPortal", "login", "demoAccess", "admin"][i])}
            </Link>
          ))}
          <p>contact@tunidrive.demo</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 TuniDrive. {t("demo")}</span>
        <div>
          {data.footer
            .filter((m) => m.status === "published")
            .map((m) => (
              <Link key={m.id} to={m.link}>
                {t(m.title)}
              </Link>
            ))}
        </div>
      </div>
    </footer>
  );
}
export function Badge({ value }: { value: string }) {
  const { t } = useApp();
  return <span className={"badge " + value}>{t(value)}</span>;
}
export function PageTitle({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">TUNIDRIVE</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
export function CarCard({ v, list = false }: { v: Row; list?: boolean }) {
  const { t, saved, setSaved } = useApp();
  const [params] = useSearchParams();
  const query = params.size ? "?" + params.toString() : "";
  return (
    <article className={"car-card " + (list ? "list-card" : "")}>
      <div className="car-image">
        <span className="category-label">{t(v.category)}</span>
        <button
          aria-label={t("saved")}
          className={"heart " + (saved.includes(v.id) ? "selected" : "")}
          onClick={() =>
            setSaved(
              saved.includes(v.id)
                ? saved.filter((x) => x !== v.id)
                : [...saved, v.id],
            )
          }
        >
          <Heart
            size={18}
            fill={saved.includes(v.id) ? "currentColor" : "none"}
          />
        </button>
        <Link to={"/fleet/" + v.id + query}>
          <img
            src={v.image}
            alt={`${t(v.category)} — ${t("illustration")}`}
            loading="lazy"
          />
        </Link>
        <small>
          {t(v.image.endsWith(".webp") ? "generatedVehicle" : "illustration")}
        </small>
      </div>
      <div className="car-body">
        <div className="row">
          <h3>{v.name}</h3>
          <Badge value={v.status} />
        </div>
        <div className="specs">
          <span>
            <Users size={16} />
            {v.passengers}
          </span>
          <span>
            <Gauge size={16} />
            {t(v.transmission)}
          </span>
          <span>
            <Briefcase size={16} />
            {v.luggage}
          </span>
        </div>
        <div className="extra-specs">
          {t(v.fuel)} · {v.doors} {t("doors")} · {t("airConditioning")}
        </div>
        <div className="car-bottom">
          <div>
            <small>{t("from")}</small>
            <strong>
              {money(v.price)} <small>{t("perDay")}</small>
            </strong>
          </div>
          <Link className="btn outline small" to={"/fleet/" + v.id + query}>
            {t("details")}
          </Link>
        </div>
        <Link className="book-link" to={"/booking/" + v.id + query}>
          {t("book")}
        </Link>
      </div>
    </article>
  );
}
export function Trust() {
  const { t } = useApp();
  return (
    <div className="trust container">
      {[
        [ShieldCheck, "freeCancellation"],
        [Check, "transparent"],
        [Headphones, "assistance"],
        [MapPin, "localExpertise"],
      ].map(([Icon, key]) => {
        const I = Icon as typeof Check;
        return (
          <div key={String(key)}>
            <I size={23} />
            <span>{t(String(key))}</span>
          </div>
        );
      })}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const { t } = useApp();
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row">
          <h2>{title}</h2>
          <button
            autoFocus
            aria-label={t("close")}
            className="icon-button"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Pagination({
  page,
  setPage,
  total,
  size = 8,
}: {
  page: number;
  setPage: (p: number) => void;
  total: number;
  size?: number;
}) {
  const { t } = useApp();
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <button
        aria-label={t("previousPage")}
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      <span>
        {Math.min(page, pages)} / {pages}
      </span>
      <button
        aria-label={t("nextPage")}
        disabled={page >= pages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
