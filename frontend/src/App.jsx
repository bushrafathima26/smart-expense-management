import { useState } from "react";

import Upload from "./pages/Upload";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerGlobalRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Upload onGlobalRefresh={triggerGlobalRefresh} />

      <Overview
        refreshKey={refreshKey}
        onGlobalRefresh={triggerGlobalRefresh}
      />

      <Dashboard refreshKey={refreshKey} />

      <AIInsights refreshKey={refreshKey} />
    </>
  );
}
