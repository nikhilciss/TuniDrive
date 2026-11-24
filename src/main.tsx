import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Provider } from "./store";
import { Header, Footer, ScrollTop } from "./components/UI";
import {
  Home,
  Fleet,
  VehicleDetail,
  Locations,
  ContentPage,
  NotFound,
} from "./pages";
import {
  BookingFlow,
  BookingDetails,
  Invoice,
  Login,
  DemoAccess,
  Account,
} from "./booking";
import { Admin } from "./admin";
import "./style.css";
function Website() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
function App() {
  return (
    <Provider>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route path="/wp-admin/login" element={<Login admin />} />
          <Route path="/wp-admin" element={<Admin />} />
          <Route path="/wp-admin/:section" element={<Admin />} />
          <Route path="/wp-admin/:section/:id" element={<Admin />} />
          <Route element={<Website />}>
            <Route index element={<Home />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="fleet/:id" element={<VehicleDetail />} />
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:id" element={<Locations />} />
            <Route path="booking/:id" element={<BookingFlow />} />
            <Route
              path="confirmation/:id"
              element={<BookingDetails confirmation />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Login register />} />
            <Route path="account" element={<Account />} />
            <Route path="account/:section" element={<Account />} />
            <Route path="account/bookings/:id" element={<BookingDetails />} />
            <Route path="account/invoices/:id" element={<Invoice />} />
            <Route path="demo-access" element={<DemoAccess />} />
            {[
              "about",
              "offers",
              "airport",
              "long-term",
              "requirements",
              "insurance",
              "faq",
              "contact",
              "terms",
              "privacy",
              "cancellation",
            ].map((p) => (
              <Route key={p} path={p} element={<ContentPage page={p} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
