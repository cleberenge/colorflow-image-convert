import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Transparency from "./pages/Transparency";
import Cookies from "./pages/Cookies";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/transparency" element={<Transparency />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;