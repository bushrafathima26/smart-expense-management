import { useEffect, useState } from "react";
import api from "../services/api";

export default function Overview({ refreshKey, onGlobalRefresh }) {
  const [data, setData] = useState(null);

  const fetchOverview = () => {
    api.get("dashboard/overview/").then(res => {
      setData(res.data);
    });
  };

  useEffect(() => {
    fetchOverview();
  }, [refreshKey]);

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "This will permanently delete ALL expense data. Continue?"
    );
    if (!confirmReset) return;

    await api.delete("admin/reset/");
    onGlobalRefresh();
  };

  if (!data) {
    return <div className="card">Loading overview…</div>;
  }

  const totalSpend = Number(data.total_spend || 0);
  const transactions = Number(data.transactions || 0);
  const monthlyBurn = Number(data.monthly_burn || 0);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="section-title">Overview</div>

        <button
          onClick={handleReset}
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Reset Data
        </button>
      </div>

      <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
        <div>
          <div className="section-subtitle">Total Spend</div>
          <strong>₹{totalSpend.toLocaleString()}</strong>
        </div>

        <div>
          <div className="section-subtitle">Transactions</div>
          <strong>{transactions}</strong>
        </div>

        <div>
          <div className="section-subtitle">Monthly Burn</div>
          <strong>₹{monthlyBurn.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}
