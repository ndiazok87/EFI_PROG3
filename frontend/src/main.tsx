import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// PrimeReact styles
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Custom styles
import "./index.css";
import "./styles/accessibility.css";
import "./styles/agro-precision-theme.css";

createRoot(document.getElementById("root")!).render(<App />);
