import { Link } from 'react-router-dom';
import { BrandHeader } from '../ui/BrandHeader';
import { Hero } from './Hero';
import { Features } from './Features';
import { PricingTable } from './PricingTable';
import { FAQ } from './FAQ';

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border-light bg-white">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center">
          <BrandHeader
            right={
              <nav className="flex items-center gap-5 text-sm">
                <a href="#pricing" className="text-text-muted hover:text-text font-medium">
                  Pricing
                </a>
                <Link
                  to="/reports"
                  className="text-text-muted hover:text-text font-medium"
                >
                  Reports
                </Link>
                <Link
                  to="/app"
                  className="text-primary font-semibold hover:text-primary-dark"
                >
                  Sign in
                </Link>
              </nav>
            }
          />
        </div>
      </div>

      <Hero />
      <Features />
      <PricingTable />
      <FAQ />

      <footer className="bg-white border-t border-border-light">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-text-muted">
          <div>
            <span className="font-semibold text-text">Time Sheets</span> by Silverback AI Agency
          </div>
          <div className="flex gap-6">
            <a href="mailto:bryan@silverbackai.agency" className="hover:text-text">
              bryan@silverbackai.agency
            </a>
            <Link to="/app" className="hover:text-text">
              Crew demo
            </Link>
          </div>
          <div className="text-xs text-text-light">
            © {new Date().getFullYear()} Silverback AI Agency
          </div>
        </div>
      </footer>
    </div>
  );
}
