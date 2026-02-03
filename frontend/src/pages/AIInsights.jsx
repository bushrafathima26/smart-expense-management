import { useEffect, useState } from "react";
import api from "../services/api";

export default function AIInsights({ refreshKey }) {
  const [insights, setInsights] = useState([]);

  const fetchInsights = () => {
    api.get("insights").then(res => {
      setInsights(res.data.insights || []);
    });
  };

  useEffect(() => {
    fetchInsights();
  }, [refreshKey]);

  return (
    <div style={{ padding: "20px" }}>
      <div className="section-title">AI Insights & Alerts</div>

      {insights.length === 0 && (
        <p style={{ color: "#6b7280" }}>No risks or anomalies detected.</p>
      )}

      {insights.map((insight, index) => (
        <div
          key={index}
          style={{
            padding: "14px",
            marginBottom: "12px",
            borderRadius: "6px",
            background: "#ffffff",
            borderLeft: `4px solid ${
              insight.level === "critical"
                ? "#ef4444"
                : insight.level === "warning"
                ? "#f59e0b"
                : "#3b82f6"
            }`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "6px" }}>
            {insight.title}
          </div>

          <div style={{ marginBottom: "6px", color: "#374151" }}>
            {insight.message}
          </div>

          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            Recommendation: {insight.recommendation}
          </div>
        </div>
      ))}
    </div>
  );
}
