import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AnalyzePage from "./pages/AnalyzePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SciencePage from "./pages/SciencePage";
import GLOBAL_CSS from "./styles/globalStyles";

const PAGES = {
  home:           HomePage,
  analyze:        AnalyzePage,
  "how-it-works": HowItWorksPage,
  science:        SciencePage,
};

export default function App() {
  const [page, setPage] = useState("home");
  const go = (id) => { setPage(id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const PageComponent = PAGES[page] || HomePage;

  return (
    <AppProvider>
      <style>{GLOBAL_CSS}</style>
      <Navbar currentPage={page} onNavigate={go} />
      <PageComponent onNavigate={go} key={page} />
      <Footer onNavigate={go} />
    </AppProvider>
  );
}
