import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/galeria" component={Galeria} />
          <Route path="/ingressos" component={Ingressos} />
          <Route path="/mensalidades" component={Mensalidades} />
          
          {/* Dev login */}
          <Route path="/dev-login" component={DevLogin} />
          
          {/* Admin routes - require authentication */}
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/dashboard" component={Dashboard} />
          <Route path="/admin/bailarinos" component={Bailarinos} />
          <Route path={"admin/cursos"} component={Cursos} />
      <Route path={"admin/matriculas"} component={Matriculas} />
      <Route path={"admin/agendamentos"} component={Agendamentos} />
      <Route path={"admin/depoimentos"} component={DepoimentosAdmin} />
      <Route path={"portal-aluno"} component={PortalAluno} />
      <Route path={"eventos"} component={Eventos} />
          
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
