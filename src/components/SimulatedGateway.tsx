import { useState } from "react";
import { useApp, money } from "../store";
import { Modal } from "./UI";
/** No card data, SDK, API call, or external navigation is involved. */
export function SimulatedGateway({
  amount,
  onApproved,
  onCancel,
}: {
  amount: number;
  onApproved: (reference: string) => void;
  onCancel: () => void;
}) {
  const { t } = useApp();
  const [declined, setDeclined] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Modal title={t("demoGateway")} onClose={onCancel}>
      <p className="notice">{t("gatewayNotice")}</p>
      <div className="payment-option">
        <strong>{t("testCard")}</strong>
        <bdi>DEMO •••• 4242</bdi>
      </div>
      <div className="price-summary">
        <div className="total">
          <span>{t("total")}</span>
          <strong>{money(amount)}</strong>
        </div>
      </div>
      {declined && (
        <p className="error" role="alert">
          {t("paymentDeclined")}
        </p>
      )}
      <div className="button-row">
        <button
          type="button"
          className="btn"
          disabled={submitted}
          onClick={() => {
            setSubmitted(true);
            onApproved("SIM-" + crypto.randomUUID().slice(0, 12).toUpperCase());
          }}
        >
          {t(declined ? "retryPayment" : "approvePayment")}
        </button>
        <button
          type="button"
          className="btn outline"
          disabled={submitted}
          onClick={() => setDeclined(true)}
        >
          {t("declinePayment")}
        </button>
        <button
          type="button"
          className="btn outline"
          disabled={submitted}
          onClick={onCancel}
        >
          {t("cancel")}
        </button>
      </div>
    </Modal>
  );
}
