export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
  avatar: string;
  joinedDate: string;
}

export type PageView = 'home' | 'login' | 'register' | 'dashboard';

export type DashboardTab =
  | 'overview'
  | 'solar'
  | 'battery'
  | 'ev'
  | 'smart-meter'
  | 'carbon'
  | 'waste'
  | 'reports'
  | 'settings';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export interface EVStation {
  id: string;
  name: string;
  portNumber: number;
  type: 'DC Fast (150kW)' | 'Level 2 (22kW)' | 'Ultra-Fast (350kW)';
  status: 'available' | 'charging' | 'finishing' | 'offline';
  currentVehicle?: string;
  currentPowerKw: number;
  energyDeliveredKwh: number;
  sessionDurationMinutes: number;
  socPercent?: number;
  user?: string;
}

export interface SolarTelemetry {
  currentPowerKw: number;
  todayGenerationKwh: number;
  weeklyGenerationKwh: number;
  monthlyGenerationKwh: number;
  efficiencyPercent: number;
  cellTemperatureC: number;
  irradianceWm2: number;
  inverterAStatus: 'Active' | 'Warning' | 'Standby';
  inverterAPowerKw: number;
  inverterBStatus: 'Active' | 'Warning' | 'Standby';
  inverterBPowerKw: number;
  hourlyGeneration: { hour: string; solarKw: number; consumptionKw: number }[];
}

export interface BatteryTelemetry {
  socPercent: number;
  sohPercent: number;
  temperatureC: number;
  capacityKwh: number;
  totalCapacityKwh: number;
  flowKw: number; // positive = charging, negative = discharging
  status: 'Charging' | 'Discharging' | 'Standby';
  cycleCount: number;
  cellVoltageMin: number;
  cellVoltageMax: number;
  modules: {
    id: string;
    voltage: number;
    temp: number;
    status: 'Optimal' | 'Warning';
  }[];
  history: { time: string; soc: number; power: number }[];
}

export interface SmartMeterTelemetry {
  currentDemandKw: number;
  todayConsumptionKwh: number;
  monthlyConsumptionKwh: number;
  peakDemandTodayKw: number;
  powerFactor: number;
  gridFrequencyHz: number;
  gridImportKwh: number;
  solarSelfConsumptionKwh: number;
  breakdown: {
    category: string;
    percentage: number;
    kwh: number;
    color: string;
  }[];
  alerts: {
    id: string;
    time: string;
    level: 'warning' | 'alert' | 'info';
    message: string;
  }[];
}

export interface CarbonTelemetry {
  totalSavedKg: number;
  todaySavedKg: number;
  monthSavedKg: number;
  treesEquivalent: number;
  gasolineGallonsAvoided: number;
  vehicleMilesOffset: number;
  gridIntensityKgPerKwh: number;
  siteIntensityKgPerKwh: number;
  monthlyHistory: { month: string; solarOffset: number; evOffset: number; wasteOffset: number }[];
}

export interface WasteTelemetry {
  totalCollectedKg: number;
  totalRecycledKg: number;
  compostedKg: number;
  energyRecoveryKwh: number;
  divertedLandfillPercent: number;
  circularEfficiencyPercent: number;
  categories: {
    type: string;
    collectedKg: number;
    recycledKg: number;
    conversionType: string;
  }[];
}
