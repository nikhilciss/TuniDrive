import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Check,
  Grid2X2,
  List,
  ShieldCheck,
  Headphones,
  Plane,
  Clock,
  Users,
  CalendarDays,
} from "lucide-react";
import { useApp, money, Row } from "./store";
import { CarCard, PageTitle, Trust, Field, Badge } from "./components/UI";
export function SearchBox() {
  const { t, data } = useApp();
  const nav = useNavigate();
  const [same, setSame] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form
      className="search-box"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const p = new URLSearchParams();
        f.forEach((v, k) => p.set(k, String(v)));
        if (same) p.set("returnLocation", p.get("location")!);
        nav("/fleet?" + p);
      }}
    >
      <div className="row search-title">
        <strong>
          <MapPin size={18} /> {t("rentalDetails")}
        </strong>
        <label className="check-label">
          <input
            type="checkbox"
            checked={same}
            onChange={(e) => setSame(e.target.checked)}
          />
          {t("sameLocation")}
        </label>
      </div>
      <div className="search-fields">
        <Field label={t("pickup")}>
          <select name="location">
            {data.locations.map((l) => (
              <option key={l.id} value={l.id}>
                {t(l.name)}
              </option>
            ))}
          </select>
        </Field>
        {!same && (
          <Field label={t("returnLocation")}>
            <select name="returnLocation">
              {data.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {t(l.name)}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label={t("pickupDate")}>
          <input
            name="pickupDate"
            type="date"
            min={today}
            defaultValue={today}
            required
          />
        </Field>
        <Field label={t("pickupTime")}>
          <input name="pickupTime" type="time" defaultValue="10:00" required />
        </Field>
        <Field label={t("returnDate")}>
          <input
            name="returnDate"
            type="date"
            min={today}
            defaultValue={new Date(Date.now() + 3 * 86400000)
              .toISOString()
              .slice(0, 10)}
            required
          />
        </Field>
        <Field label={t("returnTime")}>
          <input name="returnTime" type="time" defaultValue="10:00" required />
        </Field>
        <button className="btn" type="submit">
          {t("search")}
        </button>
      </div>
    </form>
  );
}
export function Home() {
  const { t, data, notify, lang } = useApp();
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % data.banners.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [data.banners.length]);
  const b = data.banners[slide];
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(${lang === "ar" ? 270 : 90}deg,rgba(9,31,49,.87),rgba(9,31,49,.3) 58%,rgba(9,31,49,.04)),url(${b.image})`,
          backgroundPosition: b.position,
        }}
      >
        <div className="container hero-inner">
          <div className="hero-label">
            <span /> {t("eyebrow")}
          </div>
          <h1 key={b.id}>{t(b.titleKey)}</h1>
          <p>{t(b.descriptionKey)}</p>
          <Link className="btn" to={b.link}>
            {t("book")}
          </Link>
          <div className="hero-rating">
            <div className="stars">★★★★★</div>
            <strong>4.9/5</strong>
            <span> {t("reviews")} *</span>
          </div>
          <div className="slider-controls">
            <div>
              {data.banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={t("slide") + " " + (i + 1)}
                  aria-current={slide === i}
                  className={slide === i ? "active" : ""}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
            <button
              aria-label={t("previousSlide")}
              onClick={() => setSlide((slide + 2) % 3)}
            >
              <ChevronLeft />
            </button>
            <button
              aria-label={t("nextSlide")}
              onClick={() => setSlide((slide + 1) % 3)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>
      <div className="container search-wrap">
        <SearchBox />
      </div>
      <Trust />
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t("selection")}</div>
            <h2>{t("featured")}</h2>
            <p>{t("featuredText")}</p>
          </div>
          <Link className="text-link" to="/fleet">
            {t("viewAll")}
          </Link>
        </div>
        <div className="category-tabs">
          {data.categories.map((c) => (
            <Link key={c.id} to={"/fleet?category=" + c.id}>
              {t(c.id)}
            </Link>
          ))}
        </div>
        <div className="car-grid">
          {data.vehicles
            .filter((v) => ["v3", "v13", "v17"].includes(v.id))
            .map((v) => (
              <CarCard key={v.id} v={v} />
            ))}
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t("explore")}</div>
              <h2>{t("destinations")}</h2>
              <p>{t("locationText")}</p>
            </div>
            <Link className="text-link" to="/locations">
              {t("locations")}
            </Link>
          </div>
          <div className="destination-grid">
            {[data.locations[0], data.locations[3], data.locations[7]].map(
              (l) => (
                <Link
                  className="destination"
                  key={l.id}
                  to={"/locations/" + l.id}
                >
                  <img
                    src={l.image}
                    alt={t(l.city) + " — " + t("illustration")}
                    loading="lazy"
                  />
                  <div>
                    <span>
                      <MapPin size={16} /> {t(l.city)}
                    </span>
                    <h3>{t(l.name)}</h3>
                    <p>{t("agency")}</p>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t("howText")}</div>
            <h2>{t("how")}</h2>
            <p>{t("howText")}</p>
          </div>
        </div>
        <div className="steps-grid">
          {[CalendarDays, ShieldCheck, MapPin].map((I, i) => (
            <div key={i}>
              <div className="feature-icon">
                <I />
              </div>
              <h3>{t("how" + (i + 1))}</h3>
              <p>{t(["featuredText", "insuranceText", "airportText"][i])}</p>
            </div>
          ))}
        </div>
        <div className="airport-banner">
          <div>
            <div className="eyebrow">{t("airportCities")}</div>
            <h2>{t("airportTitle")}</h2>
            <p>{t("airportText")}</p>
            <Link className="btn" to="/airport">
              {t("airport")}
            </Link>
          </div>
          <Plane size={120} strokeWidth={1} />
        </div>
      </section>
      <section className="section pale">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t("offers")}</div>
              <h2>{t("welcomeOffer")}</h2>
            </div>
            <Link className="text-link" to="/offers">
              {t("offers")}
            </Link>
          </div>
          <div className="offer-grid">
            {data.offers.slice(0, 3).map((o) => (
              <Offer key={o.id} o={o} />
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="center">
          <div className="eyebrow">{t("trusted")}</div>
          <h2>{t("reviews")}</h2>
          <p className="muted">* {t("demo")}</p>
        </div>
        <div className="reviews-grid">
          {data.testimonials.map((r) => (
            <article className="review" key={r.id}>
              <div className="stars">★★★★★</div>
              <p>“{t(r.textKey)}”</p>
              <div className="row-start">
                <span className="avatar">{r.name.slice(0, 1)}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{t(r.city)}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section container narrow">
        <h2>{t("faq")}</h2>
        <FAQ limit={5} />
        <Link className="text-link" to="/faq">
          {t("faq")}
        </Link>
      </section>
      <section className="newsletter">
        <div className="container row">
          <div>
            <h2>{t("newsletter")}</h2>
            <p>{t("newsletterText")}</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify(t("newsletterDone"));
              e.currentTarget.reset();
            }}
          >
            <input
              aria-label={t("email")}
              type="email"
              placeholder="vous@example.com"
              required
            />
            <button className="btn">{t("subscribe")}</button>
          </form>
        </div>
      </section>
    </>
  );
}
export function Fleet() {
  const { t, data } = useApp();
  const [params, setParams] = useSearchParams();
  const [grid, setGrid] = useState(true);
  const change = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    v ? p.set(k, v) : p.delete(k);
    setParams(p);
  };
  const filters = [
    ["category", data.categories.map((c) => c.id)],
    ["transmission", ["manual", "automatic"]],
    ["fuel", ["petrol", "diesel"]],
    ["passengers", ["5", "7", "9"]],
    ["status", ["available", "rented", "maintenance"]],
  ];
  const rows = data.vehicles
    .filter(
      (v) =>
        (!params.get("category") || v.category === params.get("category")) &&
        (!params.get("transmission") ||
          v.transmission === params.get("transmission")) &&
        (!params.get("fuel") || v.fuel === params.get("fuel")) &&
        (!params.get("status") || v.status === params.get("status")) &&
        (!params.get("passengers") ||
          v.passengers >= Number(params.get("passengers"))) &&
        (!params.get("location") ||
          v.locations.includes(params.get("location"))) &&
        v.price <= Number(params.get("maxPrice") || 500),
    )
    .sort((a, b) =>
      params.get("sort") === "priceAsc"
        ? a.price - b.price
        : params.get("sort") === "priceDesc"
          ? b.price - a.price
          : params.get("sort") === "category"
            ? a.category.localeCompare(b.category)
            : b.popularity - a.popularity,
    );
  return (
    <main className="container section">
      <PageTitle title={t("fleet")} sub={t("featuredText")} />
      {params.get("pickupDate") && (
        <div className="notice">
          {params.get("pickupDate")} {params.get("pickupTime")} —{" "}
          {params.get("returnDate")} {params.get("returnTime")}
        </div>
      )}
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="row">
            <h3>{t("filters")}</h3>
            <button className="text-link" onClick={() => setParams({})}>
              {t("reset")}
            </button>
          </div>
          {filters.map(([key, values]) => (
            <Field label={t(key as string)} key={key as string}>
              <select
                value={params.get(key as string) || ""}
                onChange={(e) => change(key as string, e.target.value)}
              >
                <option value="">{t("all")}</option>
                {(values as string[]).map((v) => (
                  <option key={v} value={v}>
                    {t(v)}
                  </option>
                ))}
              </select>
            </Field>
          ))}
          <Field label={t("pickup")}>
            <select
              value={params.get("location") || ""}
              onChange={(e) => change("location", e.target.value)}
            >
              <option value="">{t("all")}</option>
              {data.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {t(l.name)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={`${t("maxPrice")} · ${money(Number(params.get("maxPrice") || 500))}`}
          >
            <input
              type="range"
              min="70"
              max="500"
              step="5"
              value={params.get("maxPrice") || 500}
              onChange={(e) => change("maxPrice", e.target.value)}
            />
          </Field>
          <div className="filter-help">
            <Headphones />
            <h3>{t("assistance")}</h3>
            <Link to="/contact">{t("contact")}</Link>
          </div>
        </aside>
        <div>
          <div className="catalog-toolbar">
            <strong>
              {rows.length} {t("results")}
            </strong>
            <select
              aria-label={t("sort")}
              value={params.get("sort") || "popularity"}
              onChange={(e) => change("sort", e.target.value)}
            >
              {["popularity", "priceAsc", "priceDesc", "category"].map((k) => (
                <option key={k} value={k}>
                  {t(k)}
                </option>
              ))}
            </select>
            <button
              className="icon-button"
              aria-label={t("gridView")}
              onClick={() => setGrid(true)}
            >
              <Grid2X2 />
            </button>
            <button
              className="icon-button"
              aria-label={t("listView")}
              onClick={() => setGrid(false)}
            >
              <List />
            </button>
          </div>
          <div className={grid ? "car-grid two" : "list-grid"}>
            {rows.map((v) => (
              <div key={v.id}>
                <CarCard v={v} list={!grid} />
                {params.get("pickupDate") && (
                  <Link
                    className="btn full small"
                    to={"/booking/" + v.id + "?" + params.toString()}
                  >
                    {t("book")}
                  </Link>
                )}
              </div>
            ))}
          </div>
          {!rows.length && <div className="empty">{t("noResults")}</div>}
        </div>
      </div>
    </main>
  );
}
export function VehicleDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { t, data } = useApp();
  const v = data.vehicles.find((x) => x.id === id);
  const [image, setImage] = useState(0);
  if (!v) return <NotFound />;
  return (
    <main className="container section">
      <PageTitle title={v.name} sub={t(v.category) + " · " + v.year}>
        <Badge value={v.status} />
      </PageTitle>
      <div className="detail-grid">
        <div>
          <div className="detail-image">
            <img
              src={
                image === 1
                  ? "/assets/interior.svg"
                  : image === 2
                    ? "/assets/hero.webp"
                    : v.image
              }
              alt={t("illustration")}
            />
          </div>
          <div className="thumbnails">
            {[0, 1, 2].map((i) => (
              <button
                className={image === i ? "active" : ""}
                onClick={() => setImage(i)}
                key={i}
                aria-label={t("imageLabel") + " " + (i + 1)}
              >
                <img
                  src={
                    i === 1
                      ? "/assets/interior.svg"
                      : i === 2
                        ? "/assets/hero.webp"
                        : v.image
                  }
                  alt={t("illustration")}
                />
              </button>
            ))}
          </div>
          <small className="muted">{t("illustration")}</small>
          <div className="spec-grid">
            {[
              ["transmission", t(v.transmission)],
              ["fuel", t(v.fuel)],
              ["passengers", v.passengers],
              ["luggage", v.luggage],
              ["doors", v.doors],
              ["mileage", v.mileage + " " + t("km")],
            ].map(([k, val]) => (
              <div key={k}>
                <small>{t(k)}</small>
                <strong>{val}</strong>
              </div>
            ))}
          </div>
          <h2>{t("included")}</h2>
          <p>{t("featuredText")}</p>
          <div className="chips">
            {v.features.map((f: string) => (
              <span key={f}>
                <Check size={15} />
                {t(f)}
              </span>
            ))}
          </div>
          <h3>{t("requirements")}</h3>
          <p>{t("rulesText")}</p>
          <h3>{t("insurance")}</h3>
          <p>{t("insuranceText")}</p>
          <h3>{t("locations")}</h3>
          <div className="chips">
            {[...new Set<string>(v.locations)].map((l) => (
              <Link key={l} to={"/locations/" + l}>
                {t(data.locations.find((x) => x.id === l)?.name || "")}
              </Link>
            ))}
          </div>
          <h3>{t("calendar")} · 11/2026</h3>
          <div className="mini-calendar">
            {Array.from({ length: 30 }, (_, i) => {
              const day = `2026-11-${String(i + 1).padStart(2, "0")}`;
              const booked = data.bookings.some(
                (b) =>
                  b.vehicleId === id &&
                  b.status !== "cancelled" &&
                  b.pickupDate <= day &&
                  b.returnDate > day,
              );
              return (
                <span
                  title={t(booked ? "rented" : "available")}
                  className={booked ? "busy" : ""}
                  key={i}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        </div>
        <aside className="booking-aside card">
          <div className="eyebrow">{t("from")}</div>
          <h2>
            {money(v.price)} <small>{t("perDay")}</small>
          </h2>
          <p>
            <ShieldCheck size={18} /> {t("basicInsurance")}
          </p>
          <p>
            <Check size={18} /> {v.mileage} {t("km")} / {t("day")}
          </p>
          <p>
            <Headphones size={18} /> {t("assistance")}
          </p>
          <hr />
          <div className="row">
            <span>{t("deposit")}</span>
            <strong>{money(v.deposit)}</strong>
          </div>
          <Link
            className="btn full"
            to={"/booking/" + v.id + "?" + params.toString()}
          >
            {t("book")}
          </Link>
          <small>{t("demoNote")}</small>
        </aside>
      </div>
      <section className="section">
        <h2>{t("related")}</h2>
        <div className="car-grid">
          {data.vehicles
            .filter((x) => x.id !== id && x.category === v.category)
            .slice(0, 3)
            .map((x) => (
              <CarCard key={x.id} v={x} />
            ))}
        </div>
      </section>
    </main>
  );
}
export function Offer({ o }: { o: Row }) {
  const { t, notify } = useApp();
  return (
    <article className="offer">
      <div className="eyebrow">TUNIDRIVE · {t("offers")}</div>
      <span className="discount">−{o.discount}%</span>
      <h3>{t(o.titleKey)}</h3>
      <p>{t("period")} · 31/03/2027</p>
      <div className="row">
        <button
          className="coupon"
          onClick={() => notify(`${o.code} · ${t("success")}`)}
        >
          {o.code}
        </button>
        <Link to={"/fleet?offer=" + o.code} className="text-link">
          {t("book")}
        </Link>
      </div>
    </article>
  );
}
export function FAQ({ limit = 12 }: { limit?: number }) {
  const { t, data } = useApp();
  return (
    <div className="faq-list">
      {data.faqs.slice(0, limit).map((q) => (
        <details key={q.id}>
          <summary>{t(q.questionKey)}</summary>
          <p>{t(q.answerKey)}</p>
        </details>
      ))}
    </div>
  );
}
export function Locations() {
  const { id } = useParams();
  const { t, data } = useApp();
  const l = data.locations.find((x) => x.id === id);
  if (id && !l) return <NotFound />;
  return (
    <main className="container section">
      <PageTitle
        title={l ? t(l.name) : t("locations")}
        sub={t("locationText")}
      />
      {l ? (
        <>
          <div className="detail-grid">
            <img
              className="rounded"
              src={l.image}
              alt={t(l.city) + " — " + t("illustration")}
            />
            <div className="card">
              <h2>{t(l.city)}</h2>
              <h4>{t("address")}</h4>
              <p>{t(l.address)}</p>
              <h4>{t("hours")}</h4>
              <p>{l.hours}</p>
              <p>
                {l.email}
                <br />
                {l.phone}
              </p>
              <Link className="btn" to={"/fleet?location=" + l.id}>
                {t("search")}
              </Link>
            </div>
          </div>
          <h2>{t("fleet")}</h2>
          <div className="car-grid">
            {data.vehicles
              .filter((v) => v.locations.includes(l.id))
              .map((v) => (
                <CarCard key={v.id} v={v} />
              ))}
          </div>
        </>
      ) : (
        <div className="destination-grid">
          {data.locations.map((l) => (
            <Link key={l.id} to={"/locations/" + l.id} className="destination">
              <img
                src={l.image}
                alt={t(l.city) + " — " + t("illustration")}
                loading="lazy"
              />
              <div>
                <span>
                  {t(l.city)} · {l.hours}
                </span>
                <h3>{t(l.name)}</h3>
                <p>{t("agency")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
export function ContentPage({ page }: { page: string }) {
  const { t, data, notify } = useApp();
  const texts: Record<string, string> = {
    about: "aboutText",
    airport: "airportText",
    "long-term": "longText",
    requirements: "rulesText",
    insurance: "insuranceText",
    terms: "termsText",
    privacy: "privacyText",
    cancellation: "cancellationText",
    contact: "contactText",
  };
  return (
    <main className="container section">
      <PageTitle
        title={t(page)}
        sub={
          ["terms", "privacy", "cancellation"].includes(page)
            ? t("policyNote")
            : t("eyebrow")
        }
      />
      {page === "faq" ? (
        <FAQ />
      ) : page === "offers" ? (
        <div className="offer-grid">
          {data.offers.map((o) => (
            <Offer key={o.id} o={o} />
          ))}
        </div>
      ) : page === "contact" ? (
        <div className="detail-grid">
          <div>
            <h2>{t("contactText")}</h2>
            <p>contact@tunidrive.demo</p>
            <p>{t("coastalCities")}</p>
            <p>{t("demoNote")}</p>
            <button
              className="btn outline"
              onClick={() => notify(t("whatsappDone"))}
            >
              WhatsApp · {t("support")}
            </button>
          </div>
          <form
            className="card form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              notify(t("success"));
              e.currentTarget.reset();
            }}
          >
            <Field label={t("name")}>
              <input required defaultValue="Camille Démo" />
            </Field>
            <Field label={t("email")}>
              <input
                type="email"
                defaultValue="customer@tunidrive.demo"
                required
              />
            </Field>
            <Field label={t("message")}>
              <textarea required defaultValue={t("airportText")} />
            </Field>
            <button className="btn">{t("send")}</button>
          </form>
        </div>
      ) : (
        <div className="editorial">
          <img
            src={
              page === "about" || page === "airport"
                ? "/assets/hero.webp"
                : "/assets/location-4.svg"
            }
            alt="Tunisia — illustrative visual"
          />
          <div>
            <h2>{t(page)}</h2>
            <p>
              {t(
                data.content.find((c) => c.id === page)?.body ||
                  texts[page] ||
                  "aboutText",
              )}
            </p>
            <h3>{t("included")}</h3>
            <p>{t("insuranceText")}</p>
            <h3>{t("requirements")}</h3>
            <p>{t("rulesText")}</p>
            <p className="notice">{t("demoNote")}</p>
            <Link className="btn" to="/fleet">
              {t("search")}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
export function NotFound() {
  const { t } = useApp();
  return (
    <main className="container section center">
      <h1>404</h1>
      <h2>{t("notFound")}</h2>
      <Link className="btn" to="/">
        {t("home")}
      </Link>
    </main>
  );
}
