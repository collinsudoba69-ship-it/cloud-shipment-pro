import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Track from "./pages/Track";
import Overview from "./pages/admin/Overview";
import Shipments from "./pages/admin/Shipments";
import ShipmentForm from "./pages/admin/ShipmentForm";
import Users from "./pages/admin/Users";
import Logs from "./pages/admin/Logs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/index" element={<Index />} />
              <Route path="/track" element={<Track />} />
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="shipments" element={<Shipments />} />
                <Route path="shipments/new" element={<ShipmentForm />} />
                <Route path="shipments/:id" element={<ShipmentForm />} />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute requireSuperAdmin>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="logs"
                  element={
                    <ProtectedRoute requireSuperAdmin>
                      <Logs />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
