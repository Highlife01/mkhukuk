import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/mk/Layout";
import ProtectedRoute from "@/components/mk/ProtectedRoute";
import "@/i18n/config";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Contact from "@/pages/Contact";
import Publications from "@/pages/Publications";
import PublicationDetail from "@/pages/PublicationDetail";
import FAQ from "@/pages/FAQ";
import Glossary from "@/pages/Glossary";
import Database from "@/pages/Database";
import Guide from "@/pages/Guide";
import AiAssistant from "@/pages/AiAssistant";
import Tools from "@/pages/Tools";
import SupremeCourtDecisions from "@/pages/SupremeCourtDecisions";
import RealEstateLaw from "@/pages/RealEstateLaw";
import DynamicPage from "@/pages/DynamicPage";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages with Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/hakkimizda"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/hizmetler"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/hizmetler/:slug"
            element={
              <Layout>
                <ServiceDetail />
              </Layout>
            }
          />
          <Route
            path="/iletisim"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/yayinlar"
            element={
              <Layout>
                <Publications />
              </Layout>
            }
          />
          <Route
            path="/yayinlar/:slug"
            element={
              <Layout>
                <PublicationDetail />
              </Layout>
            }
          />
          <Route
            path="/sss"
            element={
              <Layout>
                <FAQ />
              </Layout>
            }
          />
          <Route
            path="/sozluk"
            element={
              <Layout>
                <Glossary />
              </Layout>
            }
          />
          <Route
            path="/veritabani"
            element={
              <Layout>
                <Database />
              </Layout>
            }
          />
          <Route
            path="/rehber"
            element={
              <Layout>
                <Guide />
              </Layout>
            }
          />
          <Route
            path="/ai-asistan"
            element={
              <Layout>
                <AiAssistant />
              </Layout>
            }
          />
          <Route
            path="/araclar"
            element={
              <Layout>
                <Tools />
              </Layout>
            }
          />
          <Route
            path="/yargitay-kararlari"
            element={
              <Layout>
                <SupremeCourtDecisions />
              </Layout>
            }
          />
          <Route
            path="/gayrimenkul-hukuku"
            element={
              <Layout>
                <RealEstateLaw />
              </Layout>
            }
          />
          <Route
            path="/sayfa/:slug"
            element={
              <Layout>
                <DynamicPage />
              </Layout>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
