import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlotsProvider } from "./contexts/PlotsContext";
import { ActivitiesProvider } from "./contexts/ActivitiesContext";
import { ResourcesProvider } from "./contexts/ResourcesContext";
import { WorkersProvider } from "./contexts/WorkersContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PlotsPage from "./pages/PlotsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ResourcesPage from "./pages/ResourcesPage";
import WorkersPage from "./pages/WorkersPage";
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import RequireAuth from './components/RequireAuth';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <PlotsProvider>
          <ActivitiesProvider>
            <ResourcesProvider>
              <WorkersProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                  <Route path="/parcelas" element={<RequireAuth><PlotsPage /></RequireAuth>} />
                  <Route path="/actividades" element={<RequireAuth><ActivitiesPage /></RequireAuth>} />
                  <Route path="/recursos" element={<RequireAuth><ResourcesPage /></RequireAuth>} />
                  <Route path="/trabajadores" element={<RequireAuth><WorkersPage /></RequireAuth>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WorkersProvider>
            </ResourcesProvider>
          </ActivitiesProvider>
        </PlotsProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
