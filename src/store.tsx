import {
  saveBookingRecords,
  ensureInvoiceRecord,
  prepareBooking,
  rentalDays,
  rentalQuote,
} from "./booking-model";
import React, { createContext, useContext, useEffect, useState } from "react";
import vehicles from "./data/vehicles.json";
import locations from "./data/locations.json";
import customers from "./data/customers.json";
import bookings from "./data/bookings.json";
import payments from "./data/payments.json";
import invoices from "./data/invoices.json";
import maintenance from "./data/maintenance.json";
import categories from "./data/categories.json";
import extras from "./data/extras.json";
import pricing from "./data/pricing.json";
import offers from "./data/offers.json";
import banners from "./data/banners.json";
import testimonials from "./data/testimonials.json";
import faqs from "./data/faqs.json";
import content from "./data/content.json";
import cms from "./data/cms.json";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
export type Vehicle = (typeof vehicles)[number];
export type Booking = Omit<(typeof bookings)[number], "extras"> & {
  extras: string[];
};
export type Row = Record<string, any>;
export const initial: Record<string, Row[]> = {
  vehicles,
  locations,
  customers,
  bookings,
  payments,
  invoices,
  maintenance,
  categories,
  extras,
  pricing,
  offers,
  banners,
  testimonials,
  faqs,
  content,
  ...cms,
  tickets: [],
};
type Store = {
  lang: string;
  setLang: (l: string) => void;
  t: (k: string) => string;
  data: Record<string, Row[]>;
  setRows: (key: string, rows: Row[]) => void;
  saveBooking: (draft: Row) => string;
  generateInvoice: (bookingId: string) => string;
  notify: (m: string) => void;
  user: string | null;
  setUser: (x: string | null) => void;
  admin: boolean;
  setAdmin: (x: boolean) => void;
  saved: string[];
  setSaved: (x: string[]) => void;
};
const Context = createContext<Store>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("en"),
    [data, setData] = useState(initial),
    [toast, setToast] = useState(""),
    [user, setUser] = useState<string | null>(null),
    [admin, setAdmin] = useState(false),
    [saved, setSaved] = useState<string[]>([]);
  const dictionaries: Record<string, Record<string, string>> = { fr, en, ar };
  const t = (k: string) => dictionaries[lang][k] || k;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(id);
    }
  }, [toast]);
  const saveBooking = (draft: Row) => {
    const id =
      draft.id || `TD-${Date.now()}-${crypto.randomUUID().slice(0, 4)}`;
    const values = { ...draft, id };
    prepareBooking(data, values);
    setData((current) => saveBookingRecords(current, values));
    return id;
  };
  const generateInvoice = (bookingId: string) => {
    const next = ensureInvoiceRecord(data, bookingId);
    setData((current) => ensureInvoiceRecord(current, bookingId));
    return next.invoices.find((i) => i.bookingId === bookingId)!.id;
  };
  return (
    <Context.Provider
      value={{
        lang,
        setLang,
        t,
        data,
        setRows: (key, rows) => setData((d) => ({ ...d, [key]: rows })),
        saveBooking,
        generateInvoice,
        notify: setToast,
        user,
        setUser,
        admin,
        setAdmin,
        saved,
        setSaved,
      }}
    >
      {children}
      {toast && (
        <div role="status" className="toast">
          ✓ {toast}
          <button onClick={() => setToast("")} aria-label={t("close")}>
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
export const money = (n: number) =>
  `${Number(n).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} TND`;
export const duration = rentalDays;
export const quote = rentalQuote;
export function downloadCSV(rows: Row[], name: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const escape = (x: any) =>
    '"' +
    String(typeof x === "object" ? JSON.stringify(x) : (x ?? ""))
      .replaceAll('"', '""')
      .replace(/^[=+@-]/, "'") +
    '"';
  const blob = new Blob(
    [
      "\uFEFF" +
        [
          keys.map(escape).join(","),
          ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
        ].join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
