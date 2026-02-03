import { useState } from "react";
import api from "../services/api";

export default function Upload({ onGlobalRefresh }) {
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      await api.post("upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("Upload successful ✅");
      onGlobalRefresh?.();
    } catch {
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div className="card">
      <div className="section-title">Upload Expenses</div>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleUpload}
        style={{ marginTop: "10px" }}
      />

      {status && (
        <p
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            color: status.includes("failed") ? "red" : "green",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
