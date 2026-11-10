import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CybercrimeIntelligence } from './pages/CybercrimeIntelligence';
import { BankingFraudAnalytics } from './pages/BankingFraudAnalytics';
import { UpiFraudLearning } from './pages/UpiFraudLearning';
import { HistoryTimeline } from './pages/HistoryTimeline';
import { CaseStudies } from './pages/CaseStudies';
import { FraudSimulator } from './pages/FraudSimulator';
import { FinancialForecast } from './pages/FinancialForecast';
import { AiAssistant } from './pages/AiAssistant';
import { ReportFraud } from './pages/ReportFraud';
import { UserPortal } from './pages/UserPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutMethodology } from './pages/AboutMethodology';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-cyber-darkest text-slate-100 font-sans">
      <DisclaimerBanner />
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentTab === 'landing' && <LandingPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'intelligence' && <CybercrimeIntelligence />}
        {currentTab === 'banking' && <BankingFraudAnalytics />}
        {currentTab === 'upi' && <UpiFraudLearning />}
        {currentTab === 'timeline' && <HistoryTimeline />}
        {currentTab === 'case-studies' && <CaseStudies />}
        {currentTab === 'simulator' && <FraudSimulator />}
        {currentTab === 'forecast' && <FinancialForecast />}
        {currentTab === 'assistant' && <AiAssistant />}
        {currentTab === 'report' && <ReportFraud setCurrentTab={setCurrentTab} />}
        {currentTab === 'user-portal' && <UserPortal setCurrentTab={setCurrentTab} />}
        {currentTab === 'admin' && <AdminDashboard />}
        {currentTab === 'about' && <AboutMethodology />}
        {currentTab === 'login' && <Login setCurrentTab={setCurrentTab} />}
        {currentTab === 'register' && <Register setCurrentTab={setCurrentTab} />}
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

