// src/App.jsx
import AppRoutes from "./routes/AppRoutes";
import { useAppContext } from "./contexts/AppContext"; // To use global loading
import LoadingSpinner from "./components/common/LoadingSpinner"; // To show global loading

function App() {
  const { globalLoading } = useAppContext();
  // You can add any global setup here if needed, outside of routes
  return (
    <>
      {globalLoading && <LoadingSpinner fullScreen />}
      <AppRoutes />
    </>
  );
}

export default App;
