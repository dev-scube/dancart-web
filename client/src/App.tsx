import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Galeria from "./pages/Galeria";
import Ingressos from "./pages/Ingressos";
import Mensalidades from "./pages/Mensalidades";
import Dashboard from "./pages/admin/Dashboard";
import PortalAluno from "./pages/PortalAluno";
import Eventos from "./pages/Eventos";
import Agendamentos from "./pages/admin/Agendamentos";
import DepoimentosAdmin from "./pages/admin/DepoimentosAdmin";
import Bailarinos from "./pages/admin/Bailarinos";
import Cursos from "./pages/admin/Cursos";
import Matriculas from "./pages/admin/Matriculas";
import DevLogin from "./pages/DevLogin";
import Imagens from "./pages/admin/Imagens";
import EventosAdmin from "./pages/admin/EventosAdmin";
import IngressosAdmin from "./pages/admin/IngressosAdmin";
import Noticias from "./pages/Noticias";
import NoticiasAdmin from "./pages/admin/NoticiasAdmin";

function Router() {
  const [showLoading, setShowLoading] = useState(true);

  // Check if it's the first visit or if we should skip loading
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('dancart-visited');
    const skipLoading = sessionStorage.getItem('dancart-skip-loading');
    
    if (hasVisited || skipLoading) {
      setShowLoading(false);
      // Remove skip flag after use
      if (skipLoading) {
        sessionStorage.removeItem('dancart-skip-loading');
        // If we have a hash, scroll to it after a brief delay
        setTimeout(() => {
          if (window.location.hash === '#contato') {
            const contactSection = document.getElementById('contato');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 100);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('dancart-visited', 'true');
    setShowLoading(false);
    
    // Check if we have a hash to scroll to after loading
    setTimeout(() => {
      if (window.location.hash === '#contato') {
        const contactSection = document.getElementById('contato');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public routes with Header and Footer */}
      <Route path="/" >
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      <Route path="/galeria">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Galeria />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      <Route path="/ingressos">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Ingressos />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      <Route path="/mensalidades">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Mensalidades />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      <Route path="/portal-aluno">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <PortalAluno />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      <Route path="/eventos">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Eventos />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>

      <Route path="/noticias">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Noticias />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>

      {/* Dev login */}
      <Route path="/dev-login">
        {() => (
          <PageTransition>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <DevLogin />
              </main>
              <Footer />
            </div>
          </PageTransition>
        )}
      </Route>
      
      {/* Admin routes with DashboardLayout */}
      <Route path="/admin">
        {() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/dashboard">
        {() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/bailarinos">
        {() => (
          <DashboardLayout>
            <Bailarinos />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/cursos">
        {() => (
          <DashboardLayout>
            <Cursos />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/matriculas">
        {() => (
          <DashboardLayout>
            <Matriculas />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/agendamentos">
        {() => (
          <DashboardLayout>
            <Agendamentos />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/depoimentos">
        {() => (
          <DashboardLayout>
            <DepoimentosAdmin />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/eventos">
        {() => (
          <DashboardLayout>
            <EventosAdmin />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/imagens">
        {() => (
          <DashboardLayout>
            <Imagens />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/ingressos">
        {() => (
          <DashboardLayout>
            <IngressosAdmin />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/admin/noticias">
        {() => (
          <DashboardLayout>
            <NoticiasAdmin />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
