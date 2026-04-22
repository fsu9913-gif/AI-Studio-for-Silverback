import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { TrustBar } from './sections/TrustBar';
import { Story } from './sections/Story';
import { Gallery } from './sections/Gallery';
import { ServiceArea } from './sections/ServiceArea';
import { Hours } from './sections/Hours';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Nav } from './sections/Nav';
import { useLang } from './i18n';

export default function App() {
  const { lang } = useLang();
  // Theme swap by language. ES → Mexican flag palette. EN → US flag palette.
  const theme = lang === 'es' ? 'theme-mx' : 'theme-us';

  return (
    <div className={`min-h-screen bg-cream ${theme}`}>
      <Nav />
      <Hero />
      <TrustBar />
      <Services />
      <Story />
      <Gallery />
      <ServiceArea />
      <Hours />
      <Contact />
      <Footer />
    </div>
  );
}
