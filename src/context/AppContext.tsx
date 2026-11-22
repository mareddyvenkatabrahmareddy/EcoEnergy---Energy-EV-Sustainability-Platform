import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  deleteField,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  formatFirebaseAuthError,
  handleFirestoreError,
  OperationType,
} from '../firebase.ts';
import {
  UserProfile,
  PageView,
  DashboardTab,
  NotificationItem,
  EVStation,
  SolarTelemetry,
  BatteryTelemetry,
  SmartMeterTelemetry,
  CarbonTelemetry,
  WasteTelemetry,
} from '../types/index.ts';

export interface FacilitySettings {
  solarCapacityKw: number;
  batteryCapacityKwh: number;
  alertThresholdKw: number;
}

interface AuthActionResult {
  ok: boolean;
  error?: string;
  verificationSent?: boolean;
  redirecting?: boolean;
}

interface AppContextType {
  user: UserProfile | null;
  firebaseUid: string | null;
  isAuthReady: boolean;
  isEmailVerified: boolean;
  isCloudSynced: boolean;
  authRedirectError: string | null;
  clearAuthRedirectError: () => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  facilitySettings: FacilitySettings;

  // Data
  solar: SolarTelemetry;
  battery: BatteryTelemetry;
  smartMeter: SmartMeterTelemetry;
  carbon: CarbonTelemetry;
  waste: WasteTelemetry;
  evStations: EVStation[];

  // Actions
  loginWithGoogle: () => Promise<AuthActionResult>;
  login: (email: string, pass: string) => Promise<AuthActionResult>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<AuthActionResult>;
  resetPassword: (email: string) => Promise<AuthActionResult>;
  resendVerificationEmail: () => Promise<AuthActionResult>;
  refreshEmailVerification: () => Promise<boolean>;
  logout: () => Promise<void>;
  startEVCharging: (stationId: string, vehicle: string, targetKwh: number) => void;
  stopEVCharging: (stationId: string) => void;
  setBatteryMode: (mode: 'Charging' | 'Discharging' | 'Standby') => void;
  updateUserProfile: (
    profile: Partial<UserProfile>,
    hardware?: Partial<FacilitySettings>
  ) => Promise<void>;
  exportDataCSV: (type: 'all' | 'solar' | 'ev' | 'carbon') => void;
}

const DEFAULT_SETTINGS: FacilitySettings = {
  solarCapacityKw: 120,
  batteryCapacityKwh: 100,
  alertThresholdKw: 45,
};

const INITIAL_EV_STATIONS: EVStation[] = [
  {
    id: 'ev-01',
    name: 'Station 1 - North Canopy',
    portNumber: 1,
    type: 'Ultra-Fast (350kW)',
    status: 'charging',
    currentVehicle: 'Tesla Cybertruck (Fleet #12)',
    currentPowerKw: 142.5,
    energyDeliveredKwh: 58.4,
    sessionDurationMinutes: 28,
    socPercent: 78,
    user: 'Operations Driver M. Vance',
  },
  {
    id: 'ev-02',
    name: 'Station 2 - North Canopy',
    portNumber: 2,
    type: 'DC Fast (150kW)',
    status: 'charging',
    currentVehicle: 'Rivian R1T Dual-Motor',
    currentPowerKw: 110.0,
    energyDeliveredKwh: 41.2,
    sessionDurationMinutes: 34,
    socPercent: 62,
    user: 'Sarah Jenkins',
  },
  {
    id: 'ev-03',
    name: 'Station 3 - Tech Hub',
    portNumber: 3,
    type: 'DC Fast (150kW)',
    status: 'available',
    currentPowerKw: 0,
    energyDeliveredKwh: 0,
    sessionDurationMinutes: 0,
  },
  {
    id: 'ev-04',
    name: 'Station 4 - Tech Hub',
    portNumber: 4,
    type: 'Level 2 (22kW)',
    status: 'charging',
    currentVehicle: 'Hyundai Ioniq 6 AWD',
    currentPowerKw: 18.2,
    energyDeliveredKwh: 26.8,
    sessionDurationMinutes: 85,
    socPercent: 91,
    user: 'Dr. Daniel Chen',
  },
  {
    id: 'ev-05',
    name: 'Station 5 - West Solar Array',
    portNumber: 5,
    type: 'Level 2 (22kW)',
    status: 'available',
    currentPowerKw: 0,
    energyDeliveredKwh: 0,
    sessionDurationMinutes: 0,
  },
  {
    id: 'ev-06',
    name: 'Station 6 - West Solar Array',
    portNumber: 6,
    type: 'Level 2 (22kW)',
    status: 'charging',
    currentVehicle: 'Porsche Taycan 4S',
    currentPowerKw: 22.0,
    energyDeliveredKwh: 34.5,
    sessionDurationMinutes: 92,
    socPercent: 88,
    user: 'Elena Rostova',
  },
  {
    id: 'ev-07',
    name: 'Station 7 - Visitor Bay',
    portNumber: 7,
    type: 'DC Fast (150kW)',
    status: 'available',
    currentPowerKw: 0,
    energyDeliveredKwh: 0,
    sessionDurationMinutes: 0,
  },
  {
    id: 'ev-08',
    name: 'Station 8 - Fleet Depot',
    portNumber: 8,
    type: 'Ultra-Fast (350kW)',
    status: 'available',
    currentPowerKw: 0,
    energyDeliveredKwh: 0,
    sessionDurationMinutes: 0,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Solar Peak Generation Reached',
    message: 'Solar array hit 74.5 kW generation at 12:40 PM, charging BMS at max rate.',
    time: '12 min ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'EV Fast Charging Session Started',
    message: 'Station 1 connected to Cybertruck. Delivering 142.5 kW via Ultra-Fast DC.',
    time: '28 min ago',
    type: 'info',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'BMS Cell Balance Nominal',
    message: 'All 4 lithium pack modules balanced within ±0.02V margin.',
    time: '1 hour ago',
    type: 'info',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Waste Recycling Goal Exceeded',
    message: 'Daily circular efficiency reached 87.1% (target 85%).',
    time: '3 hours ago',
    type: 'success',
    read: true,
  },
];

const INITIAL_HOURLY_SOLAR = [
  { hour: '00:00', solarKw: 0, consumptionKw: 18.2 },
  { hour: '02:00', solarKw: 0, consumptionKw: 16.5 },
  { hour: '04:00', solarKw: 0, consumptionKw: 15.8 },
  { hour: '06:00', solarKw: 4.2, consumptionKw: 19.4 },
  { hour: '08:00', solarKw: 26.5, consumptionKw: 28.1 },
  { hour: '10:00', solarKw: 58.0, consumptionKw: 34.2 },
  { hour: '12:00', solarKw: 74.5, consumptionKw: 36.8 },
  { hour: '14:00', solarKw: 68.2, consumptionKw: 35.1 },
  { hour: '16:00', solarKw: 41.0, consumptionKw: 32.4 },
  { hour: '18:00', solarKw: 12.8, consumptionKw: 27.9 },
  { hour: '20:00', solarKw: 0, consumptionKw: 24.5 },
  { hour: '22:00', solarKw: 0, consumptionKw: 20.1 },
];

function computeInitials(name: string): string {
  const cleaned = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return cleaned || 'US';
}

function clampNum(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [authRedirectError, setAuthRedirectError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const [isSimulating, setIsSimulatingState] = useState<boolean>(true);
  const [facilitySettings, setFacilitySettings] =
    useState<FacilitySettings>(DEFAULT_SETTINGS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [evStations, setEvStations] = useState<EVStation[]>(INITIAL_EV_STATIONS);

  const [solar, setSolar] = useState<SolarTelemetry>({
    currentPowerKw: 68.4,
    todayGenerationKwh: 342.8,
    weeklyGenerationKwh: 2380.0,
    monthlyGenerationKwh: 10450.0,
    efficiencyPercent: 21.8,
    cellTemperatureC: 38.4,
    irradianceWm2: 890,
    inverterAStatus: 'Active',
    inverterAPowerKw: 34.1,
    inverterBStatus: 'Active',
    inverterBPowerKw: 34.3,
    hourlyGeneration: INITIAL_HOURLY_SOLAR,
  });

  const [battery, setBattery] = useState<BatteryTelemetry>({
    socPercent: 84,
    sohPercent: 98.4,
    temperatureC: 24.6,
    capacityKwh: 84.0,
    totalCapacityKwh: 100.0,
    flowKw: 14.2,
    status: 'Charging',
    cycleCount: 412,
    cellVoltageMin: 3.28,
    cellVoltageMax: 3.31,
    modules: [
      { id: 'MOD-01', voltage: 52.8, temp: 24.4, status: 'Optimal' },
      { id: 'MOD-02', voltage: 52.7, temp: 24.9, status: 'Optimal' },
      { id: 'MOD-03', voltage: 52.9, temp: 24.5, status: 'Optimal' },
      { id: 'MOD-04', voltage: 52.8, temp: 24.6, status: 'Optimal' },
    ],
    history: [
      { time: '06:00', soc: 42, power: -4.5 },
      { time: '08:00', soc: 48, power: 8.2 },
      { time: '10:00', soc: 62, power: 18.0 },
      { time: '12:00', soc: 76, power: 16.5 },
      { time: '14:00', soc: 84, power: 14.2 },
    ],
  });

  const [smartMeter, setSmartMeter] = useState<SmartMeterTelemetry>({
    currentDemandKw: 31.4,
    todayConsumptionKwh: 284.2,
    monthlyConsumptionKwh: 7840.0,
    peakDemandTodayKw: 42.1,
    powerFactor: 0.98,
    gridFrequencyHz: 60.02,
    gridImportKwh: 12.4,
    solarSelfConsumptionKwh: 271.8,
    breakdown: [
      { category: 'HVAC & Climate Control', percentage: 38, kwh: 108.0, color: '#00C781' },
      { category: 'EV Charging Hub', percentage: 32, kwh: 91.0, color: '#00E5A0' },
      { category: 'Lighting & Campus IT', percentage: 18, kwh: 51.1, color: '#38BDF8' },
      { category: 'Industrial & Pumps', percentage: 12, kwh: 34.1, color: '#818CF8' },
    ],
    alerts: [
      {
        id: 'alt-1',
        time: '14:15 PM',
        level: 'warning',
        message: 'HVAC Chiller Compressor peak current spike detected (42.1 kW). Normalized within 90s.',
      },
      {
        id: 'alt-2',
        time: '09:00 AM',
        level: 'info',
        message: 'Campus transitioned to 94% solar self-consumption microgrid mode.',
      },
    ],
  });

  const [carbon] = useState<CarbonTelemetry>({
    totalSavedKg: 14820.0,
    todaySavedKg: 148.6,
    monthSavedKg: 4210.0,
    treesEquivalent: 674,
    gasolineGallonsAvoided: 1670,
    vehicleMilesOffset: 36800,
    gridIntensityKgPerKwh: 0.42,
    siteIntensityKgPerKwh: 0.04,
    monthlyHistory: [
      { month: 'Jun', solarOffset: 2900, evOffset: 920, wasteOffset: 340 },
      { month: 'Jul', solarOffset: 3400, evOffset: 1050, wasteOffset: 380 },
      { month: 'Aug', solarOffset: 3600, evOffset: 1100, wasteOffset: 410 },
      { month: 'Sep', solarOffset: 3200, evOffset: 1020, wasteOffset: 390 },
      { month: 'Oct', solarOffset: 3050, evOffset: 980, wasteOffset: 370 },
      { month: 'Nov', solarOffset: 2850, evOffset: 940, wasteOffset: 420 },
    ],
  });

  const [waste] = useState<WasteTelemetry>({
    totalCollectedKg: 12450.0,
    totalRecycledKg: 10850.0,
    compostedKg: 3420.0,
    energyRecoveryKwh: 1840.0,
    divertedLandfillPercent: 88.4,
    circularEfficiencyPercent: 87.1,
    categories: [
      { type: 'Organic Biomass', collectedKg: 4200, recycledKg: 3950, conversionType: 'Anaerobic Composting & Biogas' },
      { type: 'Clean Industrial Polymers', collectedKg: 3800, recycledKg: 3500, conversionType: 'High-Grade Pelletizing' },
      { type: 'Metals & Electrical Scrap', collectedKg: 2450, recycledKg: 2150, conversionType: 'Smelting & Re-extrusion' },
      { type: 'Cardboard & Fibre', collectedKg: 2000, recycledKg: 1250, conversionType: 'Pulp Recycling & Insulative Matrix' },
    ],
  });

  const bootstrapInFlightRef = useRef<string | null>(null);

  const hydrateLocalUserFromFirebase = (fbUser: User, overridePhone?: string) => {
    const profileName = fbUser.displayName || fbUser.email?.split('@')[0] || 'EcoEnergy Operator';
    let savedPhone = overridePhone;
    if (!savedPhone) {
      try {
        savedPhone = sessionStorage.getItem(`eco_pending_phone_${fbUser.uid}`) || undefined;
      } catch {
        // ignore
      }
    }
    const nextUser: UserProfile = {
      id: fbUser.uid,
      name: profileName,
      email: fbUser.email || 'user@ecoenergy.io',
      phone: savedPhone || fbUser.phoneNumber || '+1 (555) 382-9014',
      role: 'Facility & Sustainability Director',
      organization: 'Apex CleanTech Campus 01',
      avatar: computeInitials(profileName),
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    };
    setUser(nextUser);
    try {
      localStorage.setItem('eco_user', JSON.stringify(nextUser));
    } catch {
      // ignore
    }
  };

  // Check mobile Google redirect sign-in result & listen to Firebase Auth state
  useEffect(() => {
    void getRedirectResult(auth)
      .then((cred) => {
        if (cred?.user) {
          hydrateLocalUserFromFirebase(cred.user);
          setCurrentPage('dashboard');
          setDashboardTab('overview');
        }
      })
      .catch((err) => {
        setAuthRedirectError(formatFirebaseAuthError(err));
      });

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setIsEmailVerified(Boolean(fbUser?.emailVerified));
      if (fbUser) {
        hydrateLocalUserFromFirebase(fbUser);
      } else {
        setUser(null);
        try {
          localStorage.removeItem('eco_user');
        } catch {
          // ignore
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync Firestore data only when Auth is ready, authenticated, AND email is verified
  // (firestore.rules enforces request.auth.token.email_verified == true)
  useEffect(() => {
    if (!isAuthReady || !firebaseUser || !firebaseUser.emailVerified) {
      return;
    }

    const uid = firebaseUser.uid;
    let active = true;
    const unsubs: (() => void)[] = [];

    const ensureUserDocumentAndSeed = async () => {
      if (bootstrapInFlightRef.current === uid) return;
      bootstrapInFlightRef.current = uid;

      const userPath = `users/${uid}`;
      const userDocRef = doc(db, 'users', uid);

      let pendingPhone = '+1 (555) 382-9014';
      try {
        const storedPhone = sessionStorage.getItem(`eco_pending_phone_${uid}`);
        if (storedPhone) {
          pendingPhone = storedPhone;
          sessionStorage.removeItem(`eco_pending_phone_${uid}`);
        } else if (firebaseUser.phoneNumber) {
          pendingPhone = firebaseUser.phoneNumber;
        }
      } catch {
        if (firebaseUser.phoneNumber) pendingPhone = firebaseUser.phoneNumber;
      }

      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          const displayName = (
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'EcoEnergy Operator'
          ).slice(0, 80);
          const joinedLabel = new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }).slice(0, 40);

          // Step 1: Create parent facility document first so Master Gate exists() succeeds for subcollections
          await setDoc(userDocRef, {
            uid,
            name: displayName,
            role: 'Facility & Sustainability Director',
            organization: 'Apex CleanTech Campus 01',
            avatar: computeInitials(displayName),
            joinedDate: joinedLabel,
            batteryMode: 'Charging',
            isSimulating: true,
            solarCapacityKw: DEFAULT_SETTINGS.solarCapacityKw,
            batteryCapacityKwh: DEFAULT_SETTINGS.batteryCapacityKwh,
            alertThresholdKw: DEFAULT_SETTINGS.alertThresholdKw,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // Step 2: Create isolated PII document + initial EV stations + initial notifications
          const batch = writeBatch(db);
          const privateRef = doc(db, 'users', uid, 'private', 'info');
          batch.set(privateRef, {
            uid,
            email: (firebaseUser.email || 'user@ecoenergy.io').slice(0, 160),
            phone: pendingPhone.slice(0, 40),
            updatedAt: serverTimestamp(),
          });

          INITIAL_EV_STATIONS.forEach((st) => {
            const stRef = doc(db, 'users', uid, 'evStations', st.id);
            const payload: Record<string, unknown> = {
              id: st.id,
              ownerId: uid,
              name: st.name.slice(0, 80),
              portNumber: st.portNumber,
              type: st.type,
              status: st.status,
              currentPowerKw: st.currentPowerKw,
              energyDeliveredKwh: st.energyDeliveredKwh,
              sessionDurationMinutes: st.sessionDurationMinutes,
              updatedAt: serverTimestamp(),
            };
            if (st.currentVehicle) payload.currentVehicle = st.currentVehicle.slice(0, 100);
            if (typeof st.socPercent === 'number') payload.socPercent = st.socPercent;
            if (st.user) payload.operatorName = st.user.slice(0, 80);
            batch.set(stRef, payload);
          });

          INITIAL_NOTIFICATIONS.forEach((n) => {
            const nRef = doc(db, 'users', uid, 'notifications', n.id);
            batch.set(nRef, {
              id: n.id,
              ownerId: uid,
              title: n.title.slice(0, 120),
              message: n.message.slice(0, 400),
              timeLabel: n.time.slice(0, 40),
              type: n.type,
              read: n.read,
              createdAt: serverTimestamp(),
            });
          });

          await batch.commit();
        } else {
          // Ensure private/info exists even for returning profiles
          const privateRef = doc(db, 'users', uid, 'private', 'info');
          const privSnap = await getDoc(privateRef);
          if (!privSnap.exists()) {
            await setDoc(privateRef, {
              uid,
              email: (firebaseUser.email || 'user@ecoenergy.io').slice(0, 160),
              phone: (firebaseUser.phoneNumber || '+1 (555) 382-9014').slice(0, 40),
              updatedAt: serverTimestamp(),
            });
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }

      if (!active) return;

      // Live listener: Facility document
      const unsubFacility = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (!docSnap.exists()) return;
          const data = docSnap.data();
          const mode = (data.batteryMode as 'Charging' | 'Discharging' | 'Standby') || 'Charging';
          setBattery((prev) => ({
            ...prev,
            status: mode,
            flowKw: mode === 'Charging' ? 14.2 : mode === 'Discharging' ? -12.5 : 0,
          }));
          setIsSimulatingState(Boolean(data.isSimulating));
          setFacilitySettings({
            solarCapacityKw: Number(data.solarCapacityKw ?? 120),
            batteryCapacityKwh: Number(data.batteryCapacityKwh ?? 100),
            alertThresholdKw: Number(data.alertThresholdKw ?? 45),
          });
          setUser((prev) => ({
            id: uid,
            name: String(data.name || firebaseUser.displayName || 'Operator'),
            email: prev?.email || firebaseUser.email || 'user@ecoenergy.io',
            phone: prev?.phone || '+1 (555) 382-9014',
            role: String(data.role || 'Facility & Sustainability Director'),
            organization: String(data.organization || 'Apex CleanTech Campus 01'),
            avatar: String(data.avatar || computeInitials(String(data.name || 'US'))),
            joinedDate: String(data.joinedDate || 'November 2026'),
          }));
        },
        (err) => {
          handleFirestoreError(err, OperationType.GET, userPath);
        }
      );
      unsubs.push(unsubFacility);

      // Live listener: Private PII document
      const privatePath = `users/${uid}/private/info`;
      const unsubPrivate = onSnapshot(
        doc(db, 'users', uid, 'private', 'info'),
        (privSnap) => {
          if (!privSnap.exists()) return;
          const pData = privSnap.data();
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  email: String(pData.email || firebaseUser.email || prev.email),
                  phone: String(pData.phone || prev.phone),
                }
              : prev
          );
        },
        (err) => {
          handleFirestoreError(err, OperationType.GET, privatePath);
        }
      );
      unsubs.push(unsubPrivate);

      // Live listener: EV Charging Stations (secure query with ownerId filter)
      const stationsPath = `users/${uid}/evStations`;
      const stationsQuery = query(
        collection(db, 'users', uid, 'evStations'),
        where('ownerId', '==', uid)
      );
      const unsubStations = onSnapshot(
        stationsQuery,
        (snapshot) => {
          if (snapshot.empty) return;
          const items: EVStation[] = snapshot.docs
            .map((d) => {
              const s = d.data();
              return {
                id: String(s.id || d.id),
                name: String(s.name),
                portNumber: Number(s.portNumber),
                type: s.type as EVStation['type'],
                status: s.status as EVStation['status'],
                currentVehicle: s.currentVehicle ? String(s.currentVehicle) : undefined,
                currentPowerKw: Number(s.currentPowerKw ?? 0),
                energyDeliveredKwh: Number(s.energyDeliveredKwh ?? 0),
                sessionDurationMinutes: Number(s.sessionDurationMinutes ?? 0),
                socPercent: typeof s.socPercent === 'number' ? s.socPercent : undefined,
                user: s.operatorName ? String(s.operatorName) : undefined,
              };
            })
            .sort((a, b) => a.portNumber - b.portNumber);
          setEvStations(items);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, stationsPath);
        }
      );
      unsubs.push(unsubStations);

      // Live listener: Notifications (secure query with ownerId filter)
      const notifsPath = `users/${uid}/notifications`;
      const notifsQuery = query(
        collection(db, 'users', uid, 'notifications'),
        where('ownerId', '==', uid)
      );
      const unsubNotifs = onSnapshot(
        notifsQuery,
        (snapshot) => {
          const items = snapshot.docs
            .map((d) => {
              const n = d.data();
              const ts = n.createdAt instanceof Timestamp ? n.createdAt.toMillis() : 0;
              return {
                ts,
                item: {
                  id: String(n.id || d.id),
                  title: String(n.title),
                  message: String(n.message),
                  time: String(n.timeLabel || 'Just now'),
                  type: (n.type as NotificationItem['type']) || 'info',
                  read: Boolean(n.read),
                },
              };
            })
            .sort((a, b) => b.ts - a.ts)
            .map((entry) => entry.item);
          setNotifications(items);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, notifsPath);
        }
      );
      unsubs.push(unsubNotifs);
    };

    void ensureUserDocumentAndSeed();

    return () => {
      active = false;
      unsubs.forEach((u) => u());
    };
  }, [isAuthReady, firebaseUser]);

  // Visual IoT Live Streaming (local UI micro-fluctuations; preserves Firestore quota)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSolar((prev) => {
        const delta = (Math.random() - 0.48) * 0.8;
        const newPower = Math.max(0, Number((prev.currentPowerKw + delta).toFixed(1)));
        return {
          ...prev,
          currentPowerKw: newPower,
          inverterAPowerKw: Number((newPower / 2).toFixed(1)),
          inverterBPowerKw: Number((newPower / 2).toFixed(1)),
          irradianceWm2: Math.min(
            1000,
            Math.max(700, Math.round(prev.irradianceWm2 + (Math.random() - 0.5) * 8))
          ),
        };
      });

      setSmartMeter((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const newDemand = Math.max(15, Number((prev.currentDemandKw + delta).toFixed(1)));
        return {
          ...prev,
          currentDemandKw: newDemand,
        };
      });

      setEvStations((prev) =>
        prev.map((st) => {
          if (st.status === 'charging') {
            const addedKwh = Number(((st.currentPowerKw / 3600) * 2).toFixed(3));
            return {
              ...st,
              energyDeliveredKwh: Number((st.energyDeliveredKwh + addedKwh).toFixed(2)),
              sessionDurationMinutes: st.sessionDurationMinutes + 0.05,
              socPercent: Math.min(99, Number(((st.socPercent || 70) + 0.04).toFixed(1))),
            };
          }
          return st;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const loginWithGoogle = async (): Promise<AuthActionResult> => {
    setAuthRedirectError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      hydrateLocalUserFromFirebase(cred.user);
      return { ok: true };
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      // Mobile browsers / strict WebViews may block popups; fall back cleanly to redirect
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { ok: true, redirecting: true };
        } catch (redirectErr) {
          return { ok: false, error: formatFirebaseAuthError(redirectErr) };
        }
      }
      return { ok: false, error: formatFirebaseAuthError(err) };
    }
  };

  const login = async (email: string, pass: string): Promise<AuthActionResult> => {
    setAuthRedirectError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      hydrateLocalUserFromFirebase(cred.user);
      setIsEmailVerified(cred.user.emailVerified);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: formatFirebaseAuthError(err) };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<AuthActionResult> => {
    setAuthRedirectError(null);
    try {
      const cleanName = name.trim().slice(0, 80) || 'EcoEnergy Operator';
      const cleanPhone = phone.trim().slice(0, 40);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, { displayName: cleanName });
      if (cleanPhone) {
        try {
          sessionStorage.setItem(`eco_pending_phone_${cred.user.uid}`, cleanPhone);
        } catch {
          // ignore
        }
      }
      hydrateLocalUserFromFirebase(cred.user, cleanPhone);
      setIsEmailVerified(cred.user.emailVerified);

      let verificationSent = false;
      try {
        await sendEmailVerification(cred.user);
        verificationSent = true;
      } catch {
        // Do not block registration if verification email dispatch throttles
      }

      return { ok: true, verificationSent };
    } catch (err) {
      return { ok: false, error: formatFirebaseAuthError(err) };
    }
  };

  const resetPassword = async (email: string): Promise<AuthActionResult> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { ok: true };
    } catch (err) {
      return { ok: false, error: formatFirebaseAuthError(err) };
    }
  };

  const resendVerificationEmail = async (): Promise<AuthActionResult> => {
    if (!auth.currentUser) {
      return { ok: false, error: 'No active account session found.' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: formatFirebaseAuthError(err) };
    }
  };

  const refreshEmailVerification = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      const verified = Boolean(auth.currentUser.emailVerified);
      setIsEmailVerified(verified);
      setFirebaseUser(auth.currentUser);
      return verified;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    bootstrapInFlightRef.current = null;
    setIsEmailVerified(false);
    setUser(null);
    try {
      localStorage.removeItem('eco_user');
    } catch {
      // ignore
    }
    setCurrentPage('home');
  };

  const startEVCharging = (stationId: string, vehicle: string, _targetKwh: number) => {
    const cleanVehicle = (vehicle || 'Standard EV Vehicle').trim().slice(0, 100);
    const operator = (user?.name || 'On-Demand Session').trim().slice(0, 80);

    const targetStation = evStations.find((s) => s.id === stationId);
    const power = targetStation?.type.includes('350kW')
      ? 150.0
      : targetStation?.type.includes('150kW')
      ? 85.0
      : 22.0;

    setEvStations((prev) =>
      prev.map((st) =>
        st.id === stationId
          ? {
              ...st,
              status: 'charging',
              currentVehicle: cleanVehicle,
              currentPowerKw: power,
              energyDeliveredKwh: 0.1,
              sessionDurationMinutes: 1,
              socPercent: 25,
              user: operator,
            }
          : st
      )
    );

    const notifId = `notif-${Date.now()}`;
    const newNotif: NotificationItem = {
      id: notifId,
      title: 'New EV Session Initiated',
      message: `Station ${stationId} successfully connected to ${cleanVehicle}.`,
      time: 'Just now',
      type: 'info',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const stationPath = `users/${uid}/evStations/${stationId}`;
      void updateDoc(doc(db, 'users', uid, 'evStations', stationId), {
        status: 'charging',
        currentVehicle: cleanVehicle,
        currentPowerKw: power,
        energyDeliveredKwh: 0.1,
        sessionDurationMinutes: 1,
        socPercent: 25,
        operatorName: operator,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, stationPath));

      const notifPath = `users/${uid}/notifications/${notifId}`;
      void setDoc(doc(db, 'users', uid, 'notifications', notifId), {
        id: notifId,
        ownerId: uid,
        title: newNotif.title.slice(0, 120),
        message: newNotif.message.slice(0, 400),
        timeLabel: newNotif.time.slice(0, 40),
        type: newNotif.type,
        read: false,
        createdAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, notifPath));
    }
  };

  const stopEVCharging = (stationId: string) => {
    setEvStations((prev) =>
      prev.map((st) =>
        st.id === stationId
          ? {
              ...st,
              status: 'available',
              currentVehicle: undefined,
              currentPowerKw: 0,
              energyDeliveredKwh: 0,
              sessionDurationMinutes: 0,
              socPercent: undefined,
              user: undefined,
            }
          : st
      )
    );

    const notifId = `notif-${Date.now()}`;
    const newNotif: NotificationItem = {
      id: notifId,
      title: 'EV Charging Completed',
      message: `Station ${stationId} session terminated. Charger unlatched & ready for next vehicle.`,
      time: 'Just now',
      type: 'success',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const stationPath = `users/${uid}/evStations/${stationId}`;
      void updateDoc(doc(db, 'users', uid, 'evStations', stationId), {
        status: 'available',
        currentVehicle: deleteField(),
        currentPowerKw: 0,
        energyDeliveredKwh: 0,
        sessionDurationMinutes: 0,
        socPercent: deleteField(),
        operatorName: deleteField(),
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, stationPath));

      const notifPath = `users/${uid}/notifications/${notifId}`;
      void setDoc(doc(db, 'users', uid, 'notifications', notifId), {
        id: notifId,
        ownerId: uid,
        title: newNotif.title.slice(0, 120),
        message: newNotif.message.slice(0, 400),
        timeLabel: newNotif.time.slice(0, 40),
        type: newNotif.type,
        read: false,
        createdAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.CREATE, notifPath));
    }
  };

  const setBatteryMode = (mode: 'Charging' | 'Discharging' | 'Standby') => {
    setBattery((prev) => ({
      ...prev,
      status: mode,
      flowKw: mode === 'Charging' ? 14.2 : mode === 'Discharging' ? -12.5 : 0,
    }));

    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const path = `users/${uid}`;
      void updateDoc(doc(db, 'users', uid), {
        batteryMode: mode,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, path));
    }
  };

  const setIsSimulating = (sim: boolean) => {
    setIsSimulatingState(sim);
    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const path = `users/${uid}`;
      void updateDoc(doc(db, 'users', uid), {
        isSimulating: sim,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, path));
    }
  };

  const updateUserProfile = async (
    profile: Partial<UserProfile>,
    hardware?: Partial<FacilitySettings>
  ) => {
    const cleanName = (profile.name ?? user?.name ?? 'EcoEnergy Operator')
      .trim()
      .slice(0, 80) || 'EcoEnergy Operator';
    const cleanOrg = (profile.organization ?? user?.organization ?? 'Apex CleanTech Campus 01')
      .trim()
      .slice(0, 120) || 'Apex CleanTech Campus 01';
    const cleanPhone = (profile.phone ?? user?.phone ?? '').trim().slice(0, 40);
    const cleanAvatar = computeInitials(cleanName);

    const nextSettings: FacilitySettings = {
      solarCapacityKw: clampNum(
        hardware?.solarCapacityKw ?? facilitySettings.solarCapacityKw,
        1,
        100000
      ),
      batteryCapacityKwh: clampNum(
        hardware?.batteryCapacityKwh ?? facilitySettings.batteryCapacityKwh,
        1,
        100000
      ),
      alertThresholdKw: clampNum(
        hardware?.alertThresholdKw ?? facilitySettings.alertThresholdKw,
        1,
        100000
      ),
    };
    setFacilitySettings(nextSettings);

    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        ...profile,
        name: cleanName,
        organization: cleanOrg,
        phone: cleanPhone,
        avatar: cleanAvatar,
      };
      try {
        localStorage.setItem('eco_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const userPath = `users/${uid}`;
      try {
        await updateDoc(doc(db, 'users', uid), {
          name: cleanName,
          organization: cleanOrg,
          avatar: cleanAvatar,
          solarCapacityKw: nextSettings.solarCapacityKw,
          batteryCapacityKwh: nextSettings.batteryCapacityKwh,
          alertThresholdKw: nextSettings.alertThresholdKw,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, userPath);
      }

      const privPath = `users/${uid}/private/info`;
      try {
        await updateDoc(doc(db, 'users', uid, 'private', 'info'), {
          email: (firebaseUser.email || user?.email || 'user@ecoenergy.io').slice(0, 160),
          phone: cleanPhone,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, privPath);
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const path = `users/${uid}/notifications/${id}`;
      void updateDoc(doc(db, 'users', uid, 'notifications', id), {
        read: true,
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, path));
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (firebaseUser && firebaseUser.emailVerified) {
      const uid = firebaseUser.uid;
      const path = `users/${uid}/notifications`;
      void (async () => {
        try {
          const q = query(
            collection(db, 'users', uid, 'notifications'),
            where('ownerId', '==', uid)
          );
          const snap = await getDocs(q);
          if (snap.empty) return;
          const batch = writeBatch(db);
          snap.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, path);
        }
      })();
    }
  };

  const exportDataCSV = (type: 'all' | 'solar' | 'ev' | 'carbon') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    const timestamp = new Date().toISOString();

    if (type === 'solar' || type === 'all') {
      csvContent += '--- SOLAR PRODUCTION TELEMETRY ---\r\n';
      csvContent += 'Hour,Solar Generation (kW),Campus Consumption (kW)\r\n';
      solar.hourlyGeneration.forEach((row) => {
        csvContent += `${row.hour},${row.solarKw},${row.consumptionKw}\r\n`;
      });
      csvContent += `\r\nSummary: Today Total: ${solar.todayGenerationKwh} kWh, Efficiency: ${solar.efficiencyPercent}%, Irradiance: ${solar.irradianceWm2} W/m2\r\n\r\n`;
    }

    if (type === 'ev' || type === 'all') {
      csvContent += '--- EV CHARGING SESSIONS & STATIONS ---\r\n';
      csvContent += 'Station ID,Name,Type,Status,Vehicle,Delivered (kWh),Power (kW),Duration (min)\r\n';
      evStations.forEach((st) => {
        csvContent += `"${st.id}","${st.name}","${st.type}","${st.status}","${st.currentVehicle || 'N/A'}",${st.energyDeliveredKwh},${st.currentPowerKw},${Math.round(st.sessionDurationMinutes)}\r\n`;
      });
      csvContent += '\r\n';
    }

    if (type === 'carbon' || type === 'all') {
      csvContent += '--- CARBON EMISSION SAVINGS & CIRCULAR STATS ---\r\n';
      csvContent += 'Month,Solar Offset (kg CO2),EV Offset (kg CO2),Waste Offset (kg CO2)\r\n';
      carbon.monthlyHistory.forEach((m) => {
        csvContent += `${m.month},${m.solarOffset},${m.evOffset},${m.wasteOffset}\r\n`;
      });
      csvContent += `\r\nTotals: Total Saved: ${carbon.totalSavedKg} kg CO2, Trees Equivalent: ${carbon.treesEquivalent}, Landfill Diverted: ${waste.divertedLandfillPercent}%\r\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoEnergy_${type}_Report_${timestamp.slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUid: firebaseUser?.uid ?? null,
        isAuthReady,
        isEmailVerified,
        isCloudSynced: Boolean(firebaseUser && firebaseUser.emailVerified),
        authRedirectError,
        clearAuthRedirectError: () => setAuthRedirectError(null),
        currentPage,
        setCurrentPage,
        dashboardTab,
        setDashboardTab,
        notifications,
        markNotificationRead,
        clearNotifications,
        isSimulating,
        setIsSimulating,
        facilitySettings,
        solar,
        battery,
        smartMeter,
        carbon,
        waste,
        evStations,
        loginWithGoogle,
        login,
        register,
        resetPassword,
        resendVerificationEmail,
        refreshEmailVerification,
        logout,
        startEVCharging,
        stopEVCharging,
        setBatteryMode,
        updateUserProfile,
        exportDataCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
