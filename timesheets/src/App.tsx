import { Routes, Route, Navigate } from 'react-router-dom';
import { MarketingPage } from './marketing/MarketingPage';
import { NameGrid } from './employee/NameGrid';
import { PinPad } from './employee/PinPad';
import { SitePicker } from './employee/SitePicker';
import { ClockScreen } from './employee/ClockScreen';
import { MyWeek } from './employee/MyWeek';
import { ReportsPage } from './reports/ReportsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/app" element={<NameGrid />} />
      <Route path="/app/pin/:employeeId" element={<PinPad />} />
      <Route path="/app/sites" element={<SitePicker />} />
      <Route path="/app/clock" element={<ClockScreen />} />
      <Route path="/app/week" element={<MyWeek />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
