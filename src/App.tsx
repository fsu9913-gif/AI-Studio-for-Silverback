/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Lock, 
  Camera, 
  AlertTriangle, 
  UserCheck, 
  MapPin, 
  CheckCircle2,
  Cpu,
  FileText,
  Download,
  Mail,
  Plus,
  LogOut,
  LogIn,
  Loader2,
  X,
  History,
  Settings,
  Activity,
  Zap,
  Clock,
  Palette,
  Bell,
  Users,
  Scale,
  FileDown,
  Printer,
  ChevronRight,
  Building2,
  BarChart3,
  TrendingUp,
  Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  where,
  limit,
  User
} from "./firebase";
import { GoogleGenAI } from "@google/genai";

// --- Types ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

interface EventLog {
  id?: string;
  timestamp: string;
  type: 'theft' | 'break-in' | 'sublease_violation' | 'general_activity' | 'weirdness_alert';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  aiAnalysis?: string;
}

// --- Mock Chart Data ---
const DAILY_ACTIVITY = [
  { time: '00:00', events: 2, weirdness: 0.01 },
  { time: '04:00', events: 1, weirdness: 0.005 },
  { time: '08:00', events: 8, weirdness: 0.02 },
  { time: '12:00', events: 12, weirdness: 0.04 },
  { time: '16:00', events: 15, weirdness: 0.03 },
  { time: '20:00', events: 22, weirdness: 0.08 },
  { time: '23:59', events: 5, weirdness: 0.02 },
];

const WEEKLY_TRENDS = [
  { day: 'Mon', total: 45, critical: 2 },
  { day: 'Tue', total: 52, critical: 1 },
  { day: 'Wed', total: 38, critical: 0 },
  { day: 'Thu', total: 65, critical: 4 },
  { day: 'Fri', total: 88, critical: 7 },
  { day: 'Sat', total: 72, critical: 3 },
  { day: 'Sun', total: 41, critical: 1 },
];

const MONTHLY_DATA = [
  { month: 'Jan', events: 1200 },
  { month: 'Feb', events: 1100 },
  { month: 'Mar', events: 1400 },
  { month: 'Apr', events: 1800 },
  { month: 'May', events: 2100 },
  { month: 'Jun', events: 1900 },
];

const SEVERITY_DATA = [
  { name: 'Low', value: 400, color: '#3b82f6' },
  { name: 'Medium', value: 300, color: '#f59e0b' },
  { name: 'High', value: 150, color: '#ef4444' },
  { name: 'Critical', value: 50, color: '#7f1d1d' },
];

interface WeirdnessConfig {
  normalHours: number[];
  motionThreshold: number;
  lingeringThreshold: number;
  emailTo: string;
  smtpServer: string;
  rtspUrl?: string;
  rtspUsername?: string;
  rtspPassword?: string;
}

interface SecurityReport {
  id?: string;
  generatedAt: string;
  period: 'daily' | 'weekly' | 'monthly';
  summary: string;
  eventCount: number;
  highSeverityCount: number;
  status: 'generated' | 'emailed' | 'downloaded';
}

interface Tenant {
  id?: string;
  unit: string;
  name: string;
  numericId: string;
  status: 'active' | 'moved_out';
}

// --- Presentation Component ---
function PresentationView({ onClose, currentSlide, setCurrentSlide }: { onClose: () => void, currentSlide: number, setCurrentSlide: (s: number) => void }) {
  const slides = [
    {
      title: "SILVERBACK AI @ RUBY ST",
      subtitle: "Mosswood's Urban Core",
      content: "We aren't luxury, but we offer high-end tech. Protecting 3875 Ruby St with intelligent camera recognition in a neighborhood that warrants it.",
      bg: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "The Cameras Now Have Teeth",
      subtitle: "Proactive, Not Reactive",
      content: "Cameras have always been here. Now, they actively monitor for 'weirdness'—lingering, off-hours motion, and unauthorized access—without needing a human watching 24/7.",
      bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "AI Tracking Demo",
      subtitle: "Front Door & Mailboxes",
      isDemo: true,
      content: "Our AI tracks activity at the front door and mailboxes. Tenants are identified only by numeric IDs. Owners only receive footage during 'outside normal operations' alerts.",
      bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Tenant Transparency",
      subtitle: "Clear Communication",
      content: "We tell tenants upfront: The AI protects the building, but it doesn't spy on you. Faces are obscured, and footage is only pulled for 'outside normal operations' events.",
      bg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "100x More Solid As An Owner",
      subtitle: "The Pay Back Package",
      content: "Insurance deductions on proactive, digital safeguards with timestamps and papertrails that can't be defeated. More profitable per unit after savings, better tenants, and offboarding the bad ones.",
      bg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden font-sans">
      <div className="absolute top-6 right-6 z-[110] flex gap-4">
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all border border-white/10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative flex-1 flex items-center justify-center p-12"
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={slides[currentSlide].bg} 
              className="w-full h-full object-cover opacity-40 scale-105"
              alt="Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-brand-orange font-mono tracking-[0.3em] uppercase text-sm mb-4 block">
                {slides[currentSlide].subtitle}
              </span>
              <h1 className="text-7xl font-extrabold tracking-tighter text-white mb-8 leading-none">
                {slides[currentSlide].title}
              </h1>
              
              {slides[currentSlide].isDemo ? (
                <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 group">
                  <img 
                    src={slides[currentSlide].bg} 
                    className="w-full h-full object-cover"
                    alt="Lobby Demo"
                    referrerPolicy="no-referrer"
                  />
                  {/* AI Tracking Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Person 1 */}
                    <motion.div 
                      animate={{ 
                        x: [100, 150, 120, 100],
                        y: [150, 160, 140, 150]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute w-32 h-48 border-2 border-brand-orange bg-brand-orange/10 rounded-lg flex flex-col items-center"
                    >
                      <div className="absolute -top-10 left-0 bg-brand-orange text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Person #042 - Tracking
                      </div>
                      {/* Privacy Box (Shoulders Up) */}
                      <div className="w-full h-16 bg-brand-orange/80 backdrop-blur-md mt-0 rounded-t-lg flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold uppercase tracking-widest">Privacy Shield</span>
                      </div>
                    </motion.div>

                    {/* Person 2 */}
                    <motion.div 
                      animate={{ 
                        x: [600, 550, 580, 600],
                        y: [200, 220, 210, 200]
                      }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute w-28 h-40 border-2 border-zinc-400 bg-zinc-400/10 rounded-lg flex flex-col items-center"
                    >
                      <div className="absolute -top-10 left-0 bg-zinc-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Person #109 - Tracking
                      </div>
                      {/* Privacy Box (Shoulders Up) */}
                      <div className="w-full h-14 bg-zinc-400/80 backdrop-blur-md mt-0 rounded-t-lg flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold uppercase tracking-widest">Privacy Shield</span>
                      </div>
                    </motion.div>

                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-0.5 bg-brand-orange/50 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Live Feed - Front Door & Mailboxes</span>
                  </div>
                </div>
              ) : (
                <p className="text-2xl text-zinc-300 leading-relaxed max-w-2xl mb-12">
                  {slides[currentSlide].content}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="h-24 bg-zinc-900/50 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-12">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-brand-orange' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={prevSlide}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Clock className="w-8 h-8 rotate-180" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-brand-orange text-black px-8 py-3 rounded-xl font-bold hover:bg-brand-orange/90 transition-all flex items-center gap-2"
          >
            Next Slide
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Error Handling ---
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---
function NotificationToast({ notification, onClose }: { notification: EventLog, onClose: () => void, key?: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[200] w-96 bg-zinc-900/90 backdrop-blur-xl border-2 border-brand-orange/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(249,115,22,0.3)] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-orange/20 rounded-xl border border-brand-orange/30">
          <AlertTriangle className="w-6 h-6 text-brand-orange animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold">High Severity Alert</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-lg font-bold text-white mb-2 leading-tight capitalize">
            {notification.type.replace('_', ' ')}
          </h4>
          <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
            {notification.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
              <MapPin className="w-3 h-3" />
              {notification.location || 'Unknown Location'}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Animated Scanning Bar */}
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"
      />
    </motion.div>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      try {
        const parsed = JSON.parse(e.message);
        if (parsed.error) {
          setError(`Security Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`);
        }
      } catch {
        setError(e.message);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">System Error</h2>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'tenants' | 'compliance' | 'weirdness' | 'branding' | 'config'>('overview');
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [generatedAssetUrl, setGeneratedAssetUrl] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState('App Icon');
  const [selectedStyle, setSelectedStyle] = useState('High-Tech');
  const [weirdnessConfig, setWeirdnessConfig] = useState<WeirdnessConfig>({
    normalHours: Array.from({ length: 16 }, (_, i) => i + 6), // 6am-10pm
    motionThreshold: 0.05,
    lingeringThreshold: 30,
    emailTo: "bryan@norcalcarbmobile.com",
    smtpServer: "smtp.gmail.com",
    rtspUrl: "",
    rtspUsername: "",
    rtspPassword: ""
  });

  const [view, setView] = useState<'dashboard' | 'presentation'>('dashboard');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notifications, setNotifications] = useState<EventLog[]>([]);

  // --- WebSocket Connection ---
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Connected to real-time notification server');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ALERT') {
          const alert = data.payload as EventLog;
          setNotifications(prev => [alert, ...prev]);
          
          // Play alert sound if possible
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch (e) {
            console.warn("Audio playback failed", e);
          }

          // Auto-remove notification after 10 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== alert.id));
          }, 10000);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from notification server');
    };

    return () => socket.close();
  }, []);

  // --- Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: currentUser.email === "bryan@norcalcarbmobile.com" ? 'admin' : 'viewer'
            });
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    if (!user) return;

    const reportsQuery = query(collection(db, 'security_reports'), orderBy('generatedAt', 'desc'), limit(10));
    const eventsQuery = query(collection(db, 'event_logs'), orderBy('timestamp', 'desc'), limit(20));

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityReport)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'security_reports'));

    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventLog)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'event_logs'));

    const configRef = doc(db, 'config', 'weirdness');
    const unsubConfig = onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        setWeirdnessConfig(snapshot.data() as WeirdnessConfig);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/weirdness'));

    const tenantsQuery = query(collection(db, 'tenants'), orderBy('unit', 'asc'));
    const unsubTenants = onSnapshot(tenantsQuery, (snapshot) => {
      setTenants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tenant)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tenants'));

    return () => {
      unsubReports();
      unsubEvents();
      unsubConfig();
      unsubTenants();
    };
  }, [user]);

  const saveWeirdnessConfig = async (newConfig: Partial<WeirdnessConfig>) => {
    if (!user) return;
    const configRef = doc(db, 'config', 'weirdness');
    try {
      await setDoc(configRef, { ...weirdnessConfig, ...newConfig });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/weirdness');
    }
  };

  const analyzeEvent = async (event: EventLog) => {
    if (!user || !event.id) return;
    setIsAnalyzing(event.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this security event clip description and provide a more detailed, professional security assessment. 
        Event Type: ${event.type}
        Initial Description: ${event.description}
        Severity: ${event.severity}
        
        Provide a detailed breakdown of what might be happening, potential risks, and recommended actions. Keep it concise but professional.`,
      });

      const analysis = response.text || "No analysis available.";
      
      const eventRef = doc(db, 'event_logs', event.id);
      await updateDoc(eventRef, { aiAnalysis: analysis });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      handleFirestoreError(error, OperationType.UPDATE, `event_logs/${event.id}`);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const generateBrandingAsset = async () => {
    if (isGeneratingAsset) return;
    
    setIsGeneratingAsset(true);
    try {
      // Check for API key
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
      
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      const prompt = `A professional, modern, and minimalist ${selectedAssetType} for an AI security company named "Silverback AI". The style should be ${selectedStyle}. The logo should feature a powerful and sleek silverback gorilla head integrated with digital or circuit patterns to represent AI. Use a color palette of silver, charcoal gray, and a vibrant security orange. The style should be clean, high-tech, and authoritative. No text in the image.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedAssetUrl(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        console.warn("No image data found in response");
      }
    } catch (error) {
      console.error("Error generating branding asset:", error);
      // If requested entity not found, reset key
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const downloadReportCSV = (report: SecurityReport) => {
    const reportDate = new Date(report.generatedAt);
    let startDate = new Date(reportDate);
    
    if (report.period === 'daily') {
      startDate.setDate(reportDate.getDate() - 1);
    } else if (report.period === 'weekly') {
      startDate.setDate(reportDate.getDate() - 7);
    } else if (report.period === 'monthly') {
      startDate.setMonth(reportDate.getMonth() - 1);
    }

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= reportDate;
    });

    if (filteredEvents.length === 0) {
      alert("No events found for this report period.");
      return;
    }

    const headers = ["ID", "Timestamp", "Type", "Severity", "Description", "Location", "AI Analysis"];
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map(e => [
        `"${(e.id || "").replace(/"/g, '""')}"`,
        `"${e.timestamp.replace(/"/g, '""')}"`,
        `"${e.type.replace(/"/g, '""')}"`,
        `"${e.severity.replace(/"/g, '""')}"`,
        `"${e.description.replace(/"/g, '""')}"`,
        `"${(e.location || "").replace(/"/g, '""')}"`,
        `"${(e.aiAnalysis || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Silverback_Report_${report.period}_${report.generatedAt.split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const generateReport = async (period: 'daily' | 'weekly' | 'monthly') => {
    if (!user) return;
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const highSeverityCount = events.filter(e => e.severity === 'high').length;
      
      const newReport: Omit<SecurityReport, 'id'> = {
        generatedAt: new Date().toISOString(),
        period,
        summary: `AI Analysis complete for 3875 Ruby St. Detected ${events.length} total events. ${highSeverityCount} high-priority alerts require immediate attention. Perimeter integrity remains stable.`,
        eventCount: events.length,
        highSeverityCount,
        status: 'generated'
      };

      await addDoc(collection(db, 'security_reports'), newReport);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'security_reports');
    } finally {
      setIsGenerating(false);
    }
  };

  const addMockEvent = async (typeOverride?: EventLog['type']) => {
    if (!user) return;
    const types: EventLog['type'][] = ['theft', 'break-in', 'sublease_violation', 'general_activity', 'weirdness_alert'];
    const severities: EventLog['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const type = typeOverride || types[Math.floor(Math.random() * types.length)];
    const isWeird = type === 'weirdness_alert';

    const mockEvent: Omit<EventLog, 'id'> = {
      timestamp: new Date().toISOString(),
      type: type,
      description: isWeird 
        ? "WEIRD: Lingering stranger detected near the rear entrance for >30s." 
        : "AI detected suspicious movement near the rear entrance of 3875 Ruby St.",
      severity: isWeird ? 'high' : severities[Math.floor(Math.random() * severities.length)],
      location: "Rear Entrance"
    };

    try {
      const docRef = await addDoc(collection(db, 'event_logs'), mockEvent);
      
      // If high severity, trigger real-time alert via server
      if (mockEvent.severity === 'high' || mockEvent.severity === 'critical') {
        fetch('/api/trigger-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...mockEvent, id: docRef.id })
        }).catch(err => console.error("Failed to trigger server alert:", err));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'event_logs');
    }
  };

  const addMockTenant = async () => {
    if (!user) return;
    const unit = Math.floor(Math.random() * 24 + 1).toString().padStart(2, '0');
    const numericId = Math.floor(100 + Math.random() * 900).toString();
    const names = ["John Smith", "Maria Garcia", "David Chen", "Sarah Miller", "James Wilson"];
    
    const newTenant: Omit<Tenant, 'id'> = {
      unit: `Unit ${unit}`,
      name: names[Math.floor(Math.random() * names.length)],
      numericId: `#${numericId}`,
      status: 'active'
    };

    try {
      await addDoc(collection(db, 'tenants'), newTenant);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tenants');
    }
  };

  const printPresentation = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const slidesHtml = [
      {
        title: "SILVERBACK AI",
        subtitle: "Next-Generation Security Systems",
        content: "Protecting 3875 Ruby St with intelligent camera recognition and real-time weirdness detection. Secure, private, and compliant."
      },
      {
        title: "The Challenge",
        subtitle: "Vintage Property Security",
        content: "Vintage 24-unit, 3-story apartment buildings present unique security challenges. Silverback AI provides proactive monitoring while respecting tenant privacy."
      },
      {
        title: "AI Tracking Demo",
        subtitle: "Front Door & Mailboxes",
        content: "Our AI tracks activity at the front door and mailboxes. Tenants are identified only by numeric IDs. Owners only receive footage during 'outside normal operations' alerts."
      },
      {
        title: "Data Sovereignty",
        subtitle: "Oakland Law Compliance",
        content: "All footage is stored on a secure Virtual Machine (VM). Access is restricted: footage is only passed to police upon their official request for an incident, in accordance with Oakland laws and tenant rights."
      }
    ].map(s => `
      <div style="page-break-after: always; padding: 40px; font-family: sans-serif; border: 1px solid #eee; margin-bottom: 20px;">
        <div style="color: #f97316; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-bottom: 10px;">${s.subtitle}</div>
        <h1 style="font-size: 48px; margin: 0 0 20px 0; font-weight: 900;">${s.title}</h1>
        <p style="font-size: 20px; line-height: 1.6; color: #444;">${s.content}</p>
        <div style="margin-top: 100px; font-size: 10px; color: #999;">SILVERBACK AI - SECURITY | 3875 Ruby St, Oakland</div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head><title>Silverback AI Presentation</title></head>
        <body style="margin: 0; padding: 0;">
          ${slidesHtml}
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (view === 'presentation') {
    return (
      <PresentationView 
        onClose={() => setView('dashboard')} 
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-black text-zinc-100 font-sans selection:bg-brand-orange/30 security-gradient">
        {/* Real-time Notifications */}
        <AnimatePresence>
          {notifications.map((notification, idx) => (
            <NotificationToast 
              key={notification.id || `notif-${idx}`} 
              notification={notification} 
              onClose={() => setNotifications(prev => prev.filter(n => (n.id || n.timestamp) !== (notification.id || notification.timestamp)))} 
            />
          ))}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="border-b border-white/5 bg-brand-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDashboard(false)}>
              <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center border border-brand-orange/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <span className="text-brand-orange font-black text-xl tracking-tighter">SAI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl tracking-tighter leading-none">SILVERBACK AI</span>
                <span className="text-[8px] md:text-[10px] text-brand-orange font-mono tracking-[0.2em] uppercase opacity-80">Security Systems</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {user ? (
                <>
                  <button 
                    onClick={() => setView('presentation')}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Presentation</span>
                  </button>
                  <button 
                    onClick={() => setShowDashboard(!showDashboard)}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                  <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
                    <img src={user.photoURL || ""} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10" />
                    <button onClick={handleLogout} className="text-zinc-400 hover:text-white transition-colors">
                      <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {!showDashboard ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
              </div>

              <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-medium text-brand-orange mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                    Now Protecting 3875 Ruby St
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.95] text-white">
                    THE CAMERAS NOW <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-300">
                      HAVE TEETH.
                    </span>
                  </h1>
                  <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
                    Bringing high-end security tech to Mosswood's urban core. Protect your property, attract travel nurses, and ensure tenant safety without compromising privacy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? (
                      <button 
                        onClick={() => setShowDashboard(true)}
                        className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                      >
                        Access Dashboard <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleLogin}
                        className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                      >
                        Get Started <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                    <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                      View Demo
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Stats/Location Bar */}
            <section className="border-y border-white/10 bg-white/[0.02]">
              <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <MapPin className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Deployment Site</div>
                    <div className="text-lg font-semibold">3875 Ruby St, Oakland</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Cpu className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">AI Engine</div>
                    <div className="text-lg font-semibold">Silverback Edge V2.0</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <CheckCircle2 className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Status</div>
                    <div className="text-lg font-semibold">Active & Monitoring</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-black">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Modern Security</h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                    Traditional cameras just record. Silverback AI understands. 
                    Our software identifies patterns and anomalies in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Shield className="w-6 h-6 text-orange-500" />,
                      title: "Theft Prevention",
                      description: "Real-time AI monitoring to detect and deter theft before it happens."
                    },
                    {
                      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                      title: "Break-in Protection",
                      description: "Smart perimeter alerts that distinguish between residents and intruders."
                    },
                    {
                      icon: <UserCheck className="w-6 h-6 text-orange-500" />,
                      title: "Sublease Verification",
                      description: "Identify unauthorized occupants and prove sublease violations with visual evidence."
                    },
                    {
                      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                      title: "Weirdness Detection",
                      description: "Proprietary algorithm to detect 'weird' behavior like lingering strangers or high-speed motion after hours."
                    },
                    {
                      icon: <Lock className="w-6 h-6 text-orange-500" />,
                      title: "Privacy First",
                      description: "Edge-processed AI ensures recognition happens locally. No data leaks, total privacy."
                    }
                  ].map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="mb-6 p-3 bg-orange-500/10 rounded-xl inline-block group-hover:bg-orange-500/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hardware Strategy Section */}
            <section id="hardware" className="py-32 bg-zinc-900/50 border-y border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">The Hardware Strategy</h2>
                    <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                      Silverback AI is designed to run on what you already own. While many systems require expensive proprietary hubs, 
                      we recommend the "Old Laptop" approach for 3875 Ruby St.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="font-bold text-orange-500 mb-2">Why Old Laptops?</h4>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li>• Zero cost (repurpose old gear)</li>
                          <li>• Built-in battery backup (UPS)</li>
                          <li>• Superior cooling for garage environments</li>
                          <li>• Integrated screen for easy debugging</li>
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="font-bold text-blue-500 mb-2">The Tapo Advantage</h4>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li>• Tapo C120: High-res, low-light</li>
                          <li>• RTSP support for AI integration</li>
                          <li>• USB-C power simplicity</li>
                          <li>• Magnetic mount for quick positioning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-black rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <CheckCircle2 className="text-orange-500 w-6 h-6" />
                      Deployment Checklist
                    </h3>
                    <div className="space-y-6">
                      {[
                        { step: "01", title: "Prep the Base", desc: "Dust off that old laptop, plug it in a secure garage corner." },
                        { step: "02", title: "Install Core", desc: "Python + OpenCV, NumPy, and Schedule. Takes less than 5 mins." },
                        { step: "03", title: "Mount Camera", desc: "Place Tapo C120 high near mailboxes. Hide cord behind trim." },
                        { step: "04", title: "Enable RTSP", desc: "Get the URL from the Tapo app. Note the local IP address." },
                        { step: "05", title: "Run Silverback", desc: "Paste RTSP URL into the script and launch the AI engine." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="font-mono text-orange-500 font-bold">{item.step}</span>
                          <div>
                            <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                            <p className="text-xs text-zinc-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="bg-orange-500/10 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-orange-500 w-5 h-5 shrink-0" />
                        <p className="text-[10px] text-orange-200/70 font-mono uppercase tracking-wider">
                          PRO TIP: Ensure the laptop is set to "Never Sleep" when lid is closed for 24/7 monitoring.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ROI & Insurance Section */}
            <section id="roi" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-500 mb-6 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    Maximized Owner ROI
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-8">100x More Solid As An Owner.</h2>
                  <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                    Insurance deductions on proactive, digital safeguards with timestamps and papertrails that can't be defeated (unless in Oakland). This is what tenants of any caliber expect in rentals in 2026.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Up to speed in a week",
                      "Phased, forward, and legal deployment",
                      "More profitable per unit after savings",
                      "Attract better tenants, offboard the bad ones",
                      "Tenants don't feel the surveillance, just the security"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle2 className="text-brand-orange w-5 h-5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 relative">
                  <div className="aspect-square bg-gradient-to-br from-brand-orange/20 to-brand-silver/20 rounded-3xl border border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
                    <div className="relative w-full h-full bg-black/60 rounded-2xl border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 shadow-2xl">
                      <Shield className="w-16 h-16 text-brand-orange mb-6" />
                      <div className="font-mono text-sm text-brand-silver mb-2 tracking-widest uppercase">Undefeatable Papertrail</div>
                      <div className="text-lg font-bold text-white mb-4">
                        Digital Safeguards Active
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 w-full text-left font-mono text-xs text-zinc-400 space-y-2">
                        <div className="flex justify-between"><span>Timestamp:</span> <span className="text-brand-orange">{new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString()}</span></div>
                        <div className="flex justify-between"><span>Event:</span> <span className="text-white">Verified Sublease Violation</span></div>
                        <div className="flex justify-between"><span>Evidence:</span> <span className="text-green-400">Secured & Encrypted</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-gradient-to-r from-brand-orange to-orange-800 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden border border-orange-500/30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                  
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10 tracking-tighter">
                    PAY BACK PACKAGE
                  </h2>
                  <p className="text-2xl font-bold text-orange-100 mb-10 max-w-2xl mx-auto relative z-10">
                    Thank you! SILVERBACK has it from here.
                  </p>
                  <button className="bg-black text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-zinc-900 transition-all relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center gap-3 mx-auto">
                    <Zap className="w-6 h-6 text-brand-orange" />
                    Deploy to 3875 Ruby St
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Dashboard Section */
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Security Dashboard</h2>
                <p className="text-zinc-400">Manage reports and monitor events for 3875 Ruby St.</p>
              </div>
              <div className="flex overflow-x-auto no-scrollbar bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                {(['overview', 'live', 'tenants', 'compliance', 'weirdness', 'branding', 'config'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDashboardTab(tab)}
                    className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all capitalize whitespace-nowrap ${
                      dashboardTab === tab 
                        ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'live' ? 'Live View' : tab}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 md:gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
                {dashboardTab === 'tenants' && (
                  <button 
                    onClick={addMockTenant}
                    className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-brand-orange/20 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Tenant
                  </button>
                )}
                <button 
                  onClick={() => addMockEvent('weirdness_alert')}
                  className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-brand-orange/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Bell className="w-4 h-4" /> <span className="hidden sm:inline">Trigger Alert</span><span className="sm:hidden">Alert</span>
                </button>
                <button 
                  onClick={() => addMockEvent()}
                  className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Mock Event</span><span className="sm:hidden">Mock</span>
                </button>
                <button 
                  onClick={printPresentation}
                  className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-brand-orange/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print Slides</span><span className="sm:hidden">Print</span>
                </button>
                <div className="relative group">
                  <button 
                    disabled={isGenerating}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Generate Report
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {(['daily', 'weekly', 'monthly'] as const).map(p => (
                      <button 
                        key={p}
                        onClick={() => generateReport(p)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors capitalize"
                      >
                        {p} Report
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {dashboardTab === 'overview' && (
              <div className="space-y-8">
                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card p-6 security-gradient">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="text-brand-orange w-5 h-5" />
                        Activity Trends
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-bold text-brand-orange uppercase">Real-time</span>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DAILY_ACTIVITY}>
                          <defs>
                            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#f97316' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="events" 
                            stroke="#f97316" 
                            fillOpacity={1} 
                            fill="url(#colorEvents)" 
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <BarChart3 className="text-brand-orange w-5 h-5" />
                      Severity Distribution
                    </h3>
                    <div className="h-[200px] w-full mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={SEVERITY_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {SEVERITY_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {SEVERITY_DATA.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-zinc-400">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="text-brand-orange w-5 h-5" />
                        Weekly Incident Volume
                      </h3>
                    </div>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={WEEKLY_TRENDS}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis 
                            dataKey="day" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                          />
                          <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-3 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="text-brand-orange w-5 h-5" />
                        Monthly Volume (6-Month View)
                      </h3>
                    </div>
                    <div className="h-[150px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MONTHLY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                          />
                          <Area type="stepAfter" dataKey="events" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="text-orange-500 w-5 h-5" />
                    Recent Reports
                  </h3>
                  <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                      {reports.map((report) => (
                        <motion.div 
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FileText className="text-orange-500 w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold capitalize">{report.period} Security Summary</h4>
                                <p className="text-xs text-zinc-500">{new Date(report.generatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => downloadReportCSV(report)}
                                className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                title="Download CSV"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{report.summary}</p>
                          <div className="flex gap-4">
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              {report.eventCount} Events
                            </div>
                            <div className="px-3 py-1 bg-red-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400">
                              {report.highSeverityCount} High Priority
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {reports.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No reports generated yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Events Feed */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="text-orange-500 w-5 h-5" />
                    Live Event Feed
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            event.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                            event.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-tighter text-zinc-300">
                                {event.type.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-zinc-600">
                                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug mb-2">{event.description}</p>
                            
                            {event.aiAnalysis ? (
                              <div className="mt-2 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Cpu className="w-3 h-3 text-orange-500" />
                                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">AI Analysis</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                  {event.aiAnalysis}
                                </p>
                              </div>
                            ) : (
                              <button 
                                onClick={() => analyzeEvent(event)}
                                disabled={isAnalyzing === event.id}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest disabled:opacity-50"
                              >
                                {isAnalyzing === event.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3" />
                                )}
                                {isAnalyzing === event.id ? 'Analyzing...' : 'Analyze Clip'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="text-center py-10 text-zinc-600 text-sm italic">Waiting for events...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashboardTab === 'live' && (
            <div className="space-y-8">
              <div className="glass-card p-8 security-gradient">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                      <Camera className="text-brand-orange w-8 h-8" />
                      Live Camera Feeds
                    </h2>
                    <p className="text-zinc-400">Real-time monitoring of 3875 Ruby St common areas.</p>
                  </div>
                  {weirdnessConfig.rtspUrl ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Stream Connected
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Stream Offline
                    </div>
                  )}
                </div>

                {weirdnessConfig.rtspUrl ? (
                  <div className="space-y-6">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                      {/* Simulated Live Feed Image */}
                      <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover grayscale opacity-80"
                        alt="Live Feed"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Scanning Grid Overlay */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
                      
                      {/* UI Overlays */}
                      <div className="absolute top-4 left-4 flex items-center gap-3">
                        <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          LIVE
                        </div>
                        <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10">
                          CAM-01: FRONT LOBBY
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10">
                        {new Date().toLocaleTimeString()} | 24 FPS | 1080p
                      </div>

                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-zinc-400 text-[10px] font-mono px-2 py-1 rounded border border-white/10">
                        RTSP: {weirdnessConfig.rtspUrl}
                      </div>

                      {/* Simulated AI Tracking Box */}
                      <motion.div 
                        animate={{ 
                          x: [200, 250, 220, 200],
                          y: [250, 260, 240, 250]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-64 border-2 border-brand-orange bg-brand-orange/5 rounded-lg flex flex-col items-center pointer-events-none"
                      >
                        <div className="absolute -top-6 left-0 bg-brand-orange text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          ID #882 - Resident
                        </div>
                        <div className="w-full h-20 bg-brand-orange/90 backdrop-blur-md mt-0 rounded-t-lg flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-50" />
                          <span className="text-[8px] text-black font-bold uppercase tracking-widest relative z-10">Privacy Shield</span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Current Status</div>
                        <div className="text-sm font-medium text-green-400">Normal Operations</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Active AI Models</div>
                        <div className="text-sm font-medium text-white">Motion, Lingering, Privacy Blur</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Network Latency</div>
                        <div className="text-sm font-medium text-white">42ms</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
                    <Camera className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Camera Configured</h3>
                    <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                      Please configure your RTSP stream URL in the Settings tab to view the live feed.
                    </p>
                    <button 
                      onClick={() => setDashboardTab('config')}
                      className="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-500 transition-all"
                    >
                      Go to Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {dashboardTab === 'weirdness' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Zap className="text-orange-500 w-6 h-6" />
                        Weirdness Monitor
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Algorithm Active
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Current Activity Level</div>
                        <div className="text-3xl font-mono font-bold text-white">0.024%</div>
                        <div className="mt-2 text-[10px] text-zinc-400">Normal baseline: &lt; 0.03%</div>
                      </div>
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Last Detection</div>
                        <div className="text-3xl font-mono font-bold text-zinc-400">None</div>
                        <div className="mt-2 text-[10px] text-zinc-400">No weirdness in last 24h</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Active Detection Rules</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm">Off-Hours Motion (&gt;5% change)</span>
                          </div>
                          <span className="text-[10px] font-mono text-orange-500">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm">Lingering Stranger (&gt;30s detection)</span>
                          </div>
                          <span className="text-[10px] font-mono text-orange-500">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Algorithm Logic (weird_detector.py)</h4>
                    <pre className="text-[10px] font-mono text-zinc-500 bg-zinc-950 p-4 rounded-lg overflow-x-auto leading-relaxed">
{`def is_weird(frame, timestamp):
    # ... processing ...
    motion_level = cv2.countNonZero(thresh) / total_pixels
    
    # "Weird" rules:
    if motion_level > 0.05 and hour not in NORMAL_HOURS:
        return True, "Fast motion after hours"
    if motion_level > 0.03 and lingering_time > 30:
        return True, "Lingering stranger"
    return False, None`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-orange-500 w-5 h-5" />
                    Weirdness Alerts
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="text-zinc-700 w-6 h-6" />
                    </div>
                    <p className="text-zinc-500 text-sm">No weird events detected in the current session.</p>
                    <button 
                      onClick={() => addMockEvent('weirdness_alert')}
                      className="mt-6 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      Simulate Weird Event
                    </button>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'branding' && (
              <div className="space-y-8">
                <div className="glass-card p-8 security-gradient">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Palette className="text-brand-orange w-8 h-8" />
                        Silverback Branding Studio
                      </h2>
                      <p className="text-zinc-400">Generate high-quality branding assets for your Silverback security systems.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-xs font-bold text-brand-orange uppercase tracking-widest">
                      <Cpu className="w-4 h-4" />
                      Powered by Nano Banana
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Asset Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['App Icon', 'Security Sign', 'Vehicle Decal', 'Uniform Patch'].map(type => (
                            <button 
                              key={type} 
                              onClick={() => setSelectedAssetType(type)}
                              className={`px-4 py-3 rounded-xl border text-sm text-left transition-all group ${
                                selectedAssetType === type 
                                  ? 'border-brand-orange bg-brand-orange/10' 
                                  : 'border-white/5 bg-white/[0.02] hover:border-brand-orange/30 hover:bg-brand-orange/5'
                              }`}
                            >
                              <div className={`font-bold mb-1 transition-colors ${selectedAssetType === type ? 'text-brand-orange' : 'group-hover:text-brand-orange'}`}>{type}</div>
                              <div className="text-[10px] text-zinc-500">Professional {type.toLowerCase()}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Style Preference</label>
                        <div className="flex flex-wrap gap-2">
                          {['High-Tech', 'Minimalist', 'Aggressive', 'Professional', 'Futuristic'].map(style => (
                            <button 
                              key={style} 
                              onClick={() => setSelectedStyle(style)}
                              className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                selectedStyle === style
                                  ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                                  : 'border-white/10 text-zinc-400 hover:border-brand-orange hover:text-brand-orange'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          onClick={generateBrandingAsset}
                          disabled={isGeneratingAsset}
                          className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingAsset ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Zap className="w-5 h-5" />
                          )}
                          {isGeneratingAsset ? 'Generating...' : 'Generate Branding Asset'}
                        </button>
                        <p className="text-[10px] text-zinc-600 text-center mt-4 font-mono uppercase tracking-widest">
                          Estimated generation time: 12.4s
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-silver rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative glass-card bg-black/60 border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center aspect-square overflow-hidden">
                        {generatedAssetUrl ? (
                          <div className="w-full h-full relative group/img">
                            <img 
                              src={generatedAssetUrl} 
                              alt="Generated Branding Asset" 
                              className="w-full h-full object-contain rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                              <button 
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = generatedAssetUrl;
                                  link.download = `silverback-${selectedAssetType.toLowerCase().replace(' ', '-')}.png`;
                                  link.click();
                                }}
                                className="p-3 bg-brand-orange rounded-full text-white hover:scale-110 transition-transform"
                                title="Download Asset"
                              >
                                <Download className="w-6 h-6" />
                              </button>
                              <button 
                                onClick={() => setGeneratedAssetUrl(null)}
                                className="p-3 bg-white/10 rounded-full text-white hover:scale-110 transition-transform"
                                title="Clear"
                              >
                                <X className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                              <Palette className="w-10 h-10 text-zinc-700" />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Ready to Generate</h4>
                            <p className="text-zinc-500 text-sm max-w-[200px] mx-auto">Select an asset type and style to begin the AI branding process.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 border-brand-orange/20">
                    <div className="text-brand-orange font-mono text-[10px] uppercase tracking-widest mb-2">Active Palette</div>
                    <div className="flex gap-2 h-12">
                      <div className="flex-1 bg-brand-black rounded-lg border border-white/10" title="Charcoal Black"></div>
                      <div className="flex-1 bg-brand-orange rounded-lg" title="Security Orange"></div>
                      <div className="flex-1 bg-brand-silver rounded-lg" title="Silverback Gray"></div>
                      <div className="flex-1 bg-white rounded-lg" title="Pure White"></div>
                    </div>
                  </div>
                  <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Brand Font</div>
                      <div className="text-xl font-bold tracking-tighter">Inter Display</div>
                    </div>
                    <div className="text-4xl font-bold text-zinc-800">Aa</div>
                  </div>
                  <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Mono Font</div>
                      <div className="text-xl font-mono font-bold tracking-tighter">JetBrains</div>
                    </div>
                    <div className="text-4xl font-mono font-bold text-zinc-800">01</div>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'tenants' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-brand-orange" />
                          Resident Directory
                        </h3>
                        <span className="text-xs text-zinc-500 font-mono">{tenants.length} Units Registered</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                              <th className="px-6 py-4">Unit</th>
                              <th className="px-6 py-4">Resident Name</th>
                              <th className="px-6 py-4">Numeric ID (AI)</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {tenants.map((tenant) => (
                              <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-bold text-brand-orange">{tenant.unit}</td>
                                <td className="px-6 py-4 text-sm">{tenant.name}</td>
                                <td className="px-6 py-4">
                                  <span className="bg-zinc-800 px-2 py-1 rounded font-mono text-xs text-brand-silver">
                                    {tenant.numericId}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {tenant.status.replace('_', ' ')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {tenants.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                                  No residents registered yet. Use "Add Tenant" to begin.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-brand-orange" />
                        <h3 className="font-bold">Notice to Residents</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Use this template to inform existing tenants about the security upgrade.
                      </p>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-zinc-300 leading-relaxed max-h-64 overflow-y-auto mb-6">
                        <p className="font-bold mb-2 uppercase">SUBJECT: SECURITY UPGRADE AT 3875 RUBY ST</p>
                        <p>Dear Residents,</p>
                        <p className="mt-2">As part of our commitment to providing a secure environment in Mosswood, we are upgrading our building's technology. The security cameras in the common areas have always been there, but we are now equipping them with Silverback AI software.</p>
                        <p className="mt-2 font-bold">What this means for you:</p>
                        <p className="mt-1">- Better Security: The system automatically detects "weirdness" (like lingering non-residents or off-hours activity) and alerts management.</p>
                        <p className="mt-1">- Privacy First: The AI does NOT use facial recognition on residents. It tracks movement patterns, not personal identities. Faces are obscured.</p>
                        <p className="mt-1">- Peace of Mind: We are bringing high-end security tech to our building to ensure your safety in an urban neighborhood.</p>
                        <p className="mt-2">This upgrade goes live next week. If you have any questions, please contact management.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const text = `SUBJECT: SECURITY UPGRADE AT 3875 RUBY ST\n\nDear Residents,\n\nAs part of our commitment to providing a secure environment in Mosswood, we are upgrading our building's technology. The security cameras in the common areas have always been there, but we are now equipping them with Silverback AI software.\n\nWhat this means for you:\n- Better Security: The system automatically detects "weirdness" (like lingering non-residents or off-hours activity) and alerts management.\n- Privacy First: The AI does NOT use facial recognition on residents. It tracks movement patterns, not personal identities. Faces are obscured.\n- Peace of Mind: We are bringing high-end security tech to our building to ensure your safety in an urban neighborhood.\n\nThis upgrade goes live next week. If you have any questions, please contact management.`;
                          navigator.clipboard.writeText(text);
                          alert("Notice template copied to clipboard!");
                        }}
                        className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-500 transition-all mb-4"
                      >
                        Copy Notice Template
                      </button>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileDown className="w-5 h-5 text-brand-orange" />
                        <h3 className="font-bold">Lease Addendum</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                        Copy this text into your lease agreements to ensure legal compliance.
                      </p>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-zinc-300 leading-relaxed max-h-48 overflow-y-auto mb-6">
                        <p className="font-bold mb-2 uppercase">ADDENDUM: AI SECURITY MONITORING</p>
                        <p>1. The Property utilizes Silverback AI security monitoring in common areas (ingress/egress, mailboxes, lobby).</p>
                        <p className="mt-2">2. AI processing occurs locally. Residents are identified by anonymized Numeric IDs (e.g., #402) for behavioral pattern analysis.</p>
                        <p className="mt-2">3. Facial recognition is NOT used for routine monitoring. Faces are automatically obscured at the edge.</p>
                        <p className="mt-2">4. Video footage is stored on a secure, isolated Virtual Machine and is only accessed by Management during security alerts of "outside normal operations".</p>
                        <p className="mt-2">5. Footage is only shared with law enforcement upon official request for specific incident investigation.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const text = `ADDENDUM: AI SECURITY MONITORING\n\n1. The Property utilizes Silverback AI security monitoring in common areas...\n\n[Full text available in dashboard]`;
                          navigator.clipboard.writeText(text);
                          alert("Addendum template copied to clipboard!");
                        }}
                        className="w-full bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
                      >
                        Copy Lease Addendum
                      </button>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                      <h4 className="font-bold text-sm mb-4">Why Tell Tenants?</h4>
                      <div className="space-y-4 text-xs text-zinc-400">
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <p><span className="text-white font-medium">Transparency:</span> Reduces friction and builds trust with residents.</p>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <p><span className="text-white font-medium">Deterrence:</span> Knowing AI is monitoring "weirdness" prevents internal incidents.</p>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <p><span className="text-white font-medium">Legal Safety:</span> Disclosure is key to compliance with Oakland privacy laws.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'compliance' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Scale className="w-6 h-6 text-brand-orange" />
                      <h3 className="text-2xl font-bold">Legal Framework</h3>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-brand-orange" />
                          Oakland Surveillance Ordinance (9.64)
                        </h4>
                        <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                          Silverback AI is designed to meet the strict transparency requirements of Oakland's surveillance laws. 
                          By using edge-processing and anonymized IDs, we minimize "surveillance creep" while maximizing security.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-brand-orange" />
                          Tenant Protection Act (AB 1482)
                        </h4>
                        <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                          Our sublease verification tools provide the "Just Cause" evidence required for enforcement under AB 1482, 
                          ensuring property owners have verifiable data for lease compliance.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-brand-orange" />
                          Reasonable Expectation of Privacy
                        </h4>
                        <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                          Courts generally uphold monitoring in common areas (lobbies, mailrooms) as long as residents are notified. 
                          Silverback AI never monitors private dwelling spaces.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Building2 className="w-6 h-6 text-brand-orange" />
                      <h3 className="text-2xl font-bold">Deployment Guide</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <h5 className="font-bold mb-4 text-brand-silver uppercase text-xs tracking-widest">Current Camera Integration</h5>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                            <p className="text-sm text-zinc-400"><span className="text-white font-medium">RTSP Handshake:</span> Connect your existing IP cameras (Tapo, Amcrest, etc.) via RTSP in the Config tab.</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                            <p className="text-sm text-zinc-400"><span className="text-white font-medium">Edge Node:</span> Deploy a local VM or "Old Laptop" as the processing node to keep data on-site.</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                            <p className="text-sm text-zinc-400"><span className="text-white font-medium">Zone Definition:</span> Focus cameras on the front door and mailbox bank for maximum impact.</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-brand-orange/5 rounded-2xl border border-brand-orange/10">
                        <h5 className="font-bold mb-4 text-brand-orange uppercase text-xs tracking-widest">Recommended Hardware</h5>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li className="flex justify-between"><span>Primary Camera:</span> <span className="text-white">Tapo C120 (RTSP)</span></li>
                          <li className="flex justify-between"><span>Processing:</span> <span className="text-white">i5 Laptop / 8GB RAM</span></li>
                          <li className="flex justify-between"><span>Storage:</span> <span className="text-white">500GB SSD (Encrypted)</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dashboardTab === 'config' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Settings className="text-zinc-400 w-6 h-6" />
                    Algorithm Configuration
                  </h3>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Normal Hours (Start)</label>
                        <input 
                          type="number" 
                          value={weirdnessConfig.normalHours[0]}
                          onChange={(e) => {
                            const start = parseInt(e.target.value);
                            const end = weirdnessConfig.normalHours[weirdnessConfig.normalHours.length - 1];
                            const newHours = Array.from({ length: end - start + 1 }, (_, i) => i + start);
                            setWeirdnessConfig({ ...weirdnessConfig, normalHours: newHours });
                          }}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Normal Hours (End)</label>
                        <input 
                          type="number" 
                          value={weirdnessConfig.normalHours[weirdnessConfig.normalHours.length - 1]}
                          onChange={(e) => {
                            const end = parseInt(e.target.value);
                            const start = weirdnessConfig.normalHours[0];
                            const newHours = Array.from({ length: end - start + 1 }, (_, i) => i + start);
                            setWeirdnessConfig({ ...weirdnessConfig, normalHours: newHours });
                          }}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Motion Threshold (%)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={weirdnessConfig.motionThreshold * 100}
                        onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, motionThreshold: parseInt(e.target.value) / 100 })}
                        className="w-full accent-orange-500"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                        <span>1% (Sensitive)</span>
                        <span>{Math.round(weirdnessConfig.motionThreshold * 100)}% (Current)</span>
                        <span>20% (Low)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Alert Email</label>
                      <input 
                        type="email" 
                        value={weirdnessConfig.emailTo}
                        onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, emailTo: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <h4 className="text-lg font-bold mb-6 text-zinc-300">Camera Stream Configuration</h4>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">RTSP URL</label>
                          <input 
                            type="text" 
                            placeholder="rtsp://192.168.1.100:554/stream1"
                            value={weirdnessConfig.rtspUrl || ""}
                            onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspUrl: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Username</label>
                            <input 
                              type="text" 
                              value={weirdnessConfig.rtspUsername || ""}
                              onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspUsername: e.target.value })}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Password</label>
                            <input 
                              type="password" 
                              value={weirdnessConfig.rtspPassword || ""}
                              onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspPassword: e.target.value })}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <button 
                        onClick={() => saveWeirdnessConfig(weirdnessConfig)}
                        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Compliance Section */}
            <div className="mt-8 p-6 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-brand-orange" />
                <h3 className="font-bold text-lg">Privacy & Compliance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-400 leading-relaxed">
                <div className="space-y-3">
                  <p>
                    <span className="text-white font-medium">Tenant Privacy:</span> Tenants are identified only by anonymized numeric IDs. No facial data or PII is stored in the primary detection database.
                  </p>
                  <p>
                    <span className="text-white font-medium">Data Sovereignty:</span> All footage is stored on a secure, isolated Virtual Machine (VM). Owners only receive footage alerts for "outside normal operations" events.
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="text-white font-medium">Law Enforcement:</span> Footage is only shared with police upon official request for specific incidents, ensuring full compliance with Oakland surveillance ordinances.
                  </p>
                  <p>
                    <span className="text-white font-medium">Rights:</span> Our systems are designed to respect tenant rights and local laws while maintaining property security.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-black mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-orange/20 rounded-lg flex items-center justify-center border border-brand-orange/30">
                <span className="text-brand-orange font-black text-xs tracking-tighter">SAI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white">SILVERBACK AI</span>
                <span className="text-[8px] text-brand-orange font-mono tracking-widest uppercase">Security</span>
              </div>
            </div>
            <div className="text-zinc-500 text-sm text-center md:text-left">
              © 2026 SILVERBACK AI - SECURITY. Secure and Smart. 3875 Ruby St, Oakland.<br/>
              <span className="text-[10px] opacity-60">Compliant with Oakland Surveillance Ordinances & Tenant Rights.</span>
            </div>
            <div className="flex gap-6 text-zinc-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
