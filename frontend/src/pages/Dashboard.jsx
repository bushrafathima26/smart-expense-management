import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import api from "../services/api";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const FIXED_BUDGET = 1200000;

export default function Dashboard({ refreshKey }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [yearlyBudgetData, setYearlyBudgetData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);

  const monthlyRef = useRef(null);
  const budgetRef = useRef(null);
  const categoryRef = useRef(null);
  const vendorRef = useRef(null);

  const fetchDashboard = () => {
    api.get("dashboard/monthly-trend/").then(res => setMonthlyData(res.data));
    api.get("dashboard/category-distribution/").then(res => setCategoryData(res.data));
    api.get("dashboard/vendor-comparison/").then(res => setVendorData(res.data));
  };

  const fetchYearlyBudget = () => {
    api.get("dashboard/yearly-budget-vs-actual", {
      params: { year: selectedYear }
    }).then(res => {
      setYearlyBudgetData([
        { name: "Fixed Budget", amount: FIXED_BUDGET },
        { name: "Actual Spend", amount: res.data.actual_spent }
      ]);
    });
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshKey]);

  useEffect(() => {
    fetchYearlyBudget();
  }, [selectedYear]);

  const downloadChart = async (ref, filename) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  };

  const renderDonutLabel = ({ name, percent }) =>
    `${name} (${(percent * 100).toFixed(1)}%)`;

  return (
    <div className="dashboard-container">
      <div className="card">
        <div className="section-title">
          Monthly Expense Trend
          <button onClick={() => downloadChart(monthlyRef, "monthly_trend.jpg")}>
            ⬇ JPG
          </button>
        </div>

        <div ref={monthlyRef}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="amount" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}>
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button onClick={() => downloadChart(budgetRef, `budget_${selectedYear}.jpg`)}>
            ⬇ JPG
          </button>
        </div>

        <div ref={budgetRef}>
          {yearlyBudgetData && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyBudgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          Expense Distribution
          <button onClick={() => downloadChart(categoryRef, "category_distribution.jpg")}>
            ⬇ JPG
          </button>
        </div>

        <div ref={categoryRef}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                innerRadius={70}
                outerRadius={100}
                label={renderDonutLabel}
              >
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#2563eb", "#10b981", "#f59e0b", "#6366f1", "#ef4444"][i % 5]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          Top Vendor Spend
          <button onClick={() => downloadChart(vendorRef, "vendor_comparison.jpg")}>
            ⬇ JPG
          </button>
        </div>

        <div ref={vendorRef}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="vendor" type="category" />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
