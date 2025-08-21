import { useState, useEffect } from 'react';
import { Header } from './dashboard/Header';
import { StatusTiles } from './dashboard/StatusTiles';
import { TrendPanels } from './dashboard/TrendPanels';
import { AlarmsSection } from './dashboard/AlarmsSection';
import { ChatbotPanel } from './dashboard/ChatbotPanel';
import { useToast } from '@/hooks/use-toast';

export interface DashboardData {
  // Temperature readings
  T2_temp_mean: number | null;
  T1_temp_mean: number | null;
  T0_temp_mean: number | null;
  TH_temp_mean: number | null;
  
  // Temperature fallbacks
  T2_1_ambient_temp: number | null;
  T2_2_ambient_temp: number | null;
  T1_1_cold_air_temp: number | null;
  T1_2_cold_air_temp: number | null;
  T0_1_air_outlet_temp: number | null;
  T0_2_air_outlet_temp: number | null;
  TH_1_supply_air_temp: number | null;
  TH_2_supply_air_temp: number | null;
  
  // Pressures
  LP_value: number | null;
  HP_value: number | null;
  LP_set_point: number | null;
  HP_set_point: number | null;
  
  // Setpoints
  T1_set_point: number | null;
  TH_T1_set_point: number | null;
  
  // Actuator outputs
  Blower_speed: number | null;
  Cond_fan_speed: number | null;
  Hot_valve_speed: number | null;
  AHT_vale_speed: number | null;
  Heater_speed: number | null;
  
  // Digital states
  Compressor_on_Q0_4: string | boolean;
  Blower_drive_on_Q0_0: string | boolean;
  Condenser_fan_drive_on_Q0_3: string | boolean;
  Hot_gas_valve_on_Q0_7: string | boolean;
  Heater_drive_on_Q0_2: string | boolean;
  
  // Modes
  Auto_mode: string | boolean;
  Manual_mode: string | boolean;
  Aeration_mode: string | boolean;
  Continuous_mode: string | boolean;
  
  // Health & faults
  Chiller_healthy_on_Q1_1: string | boolean;
  Chiller_Fault_on_Q2_0: string | boolean;
  Collective_Trouble_Signal_on_Q2_1: string | boolean;
  Fault_code: number | null;
  
  // Fault bits
  High_Pressure_Fault: string | boolean;
  Low_Pressure_Fault: string | boolean;
  Three_phase_monitor_fault: string | boolean;
  Compressor_motor_overheat: string | boolean;
  Anti_Freeze_Protection: string | boolean;
  TH_Temp_more_than_50C: string | boolean;
  
  // Sensor faults
  Ambient_Temp_Sensor_T2_1_Open: string | boolean;
  Ambient_Temp_Sensor_T2_1_Short_Circuit: string | boolean;
  Cold_Air_Temp_Sensor_T1_1_Open: string | boolean;
  Cold_Air_Temp_Sensor_T1_1_Short_Circuit: string | boolean;
  
  // Runtime
  Running_hours: number | null;
  Running_time_hour: number | null;
  Running_time_minute: number | null;
  Compressor_timer: number | null;
  
  // Timestamp
  created_at: string;
}

export interface TrendData {
  timestamp: string;
  ambient: number | null;
  return: number | null;
  supply: number | null;
  afterHeater: number | null;
  lpPressure: number | null;
  hpPressure: number | null;
  lpSetpoint: number | null;
  hpSetpoint: number | null;
  blowerSpeed: number | null;
  condFanSpeed: number | null;
  hotValveSpeed: number | null;
  heaterSpeed: number | null;
}

export const Dashboard = () => {
  const [currentData, setCurrentData] = useState<DashboardData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration - replace with actual API calls
  const generateMockData = (): DashboardData => {
    const now = new Date();
    return {
      // Temperatures
      T2_temp_mean: 22 + Math.random() * 5,
      T1_temp_mean: 18 + Math.random() * 4,
      T0_temp_mean: 12 + Math.random() * 3,
      TH_temp_mean: 25 + Math.random() * 5,
      
      // Fallbacks
      T2_1_ambient_temp: 22.1 + Math.random() * 5,
      T2_2_ambient_temp: 21.9 + Math.random() * 5,
      T1_1_cold_air_temp: 18.1 + Math.random() * 4,
      T1_2_cold_air_temp: 17.9 + Math.random() * 4,
      T0_1_air_outlet_temp: 12.1 + Math.random() * 3,
      T0_2_air_outlet_temp: 11.9 + Math.random() * 3,
      TH_1_supply_air_temp: 25.1 + Math.random() * 5,
      TH_2_supply_air_temp: 24.9 + Math.random() * 5,
      
      // Pressures
      LP_value: 2.1 + Math.random() * 0.5,
      HP_value: 12.5 + Math.random() * 2,
      LP_set_point: 2.0,
      HP_set_point: 12.0,
      
      // Setpoints
      T1_set_point: 18.0,
      TH_T1_set_point: 25.0,
      
      // Actuators
      Blower_speed: 60 + Math.random() * 20,
      Cond_fan_speed: 70 + Math.random() * 15,
      Hot_valve_speed: 45 + Math.random() * 25,
      AHT_vale_speed: 30 + Math.random() * 20,
      Heater_speed: 20 + Math.random() * 15,
      
      // Digital states
      Compressor_on_Q0_4: Math.random() > 0.3,
      Blower_drive_on_Q0_0: Math.random() > 0.2,
      Condenser_fan_drive_on_Q0_3: Math.random() > 0.3,
      Hot_gas_valve_on_Q0_7: Math.random() > 0.5,
      Heater_drive_on_Q0_2: Math.random() > 0.7,
      
      // Modes
      Auto_mode: Math.random() > 0.5,
      Manual_mode: Math.random() < 0.5,
      Aeration_mode: Math.random() > 0.8,
      Continuous_mode: Math.random() > 0.7,
      
      // Health
      Chiller_healthy_on_Q1_1: Math.random() > 0.1,
      Chiller_Fault_on_Q2_0: Math.random() < 0.1,
      Collective_Trouble_Signal_on_Q2_1: Math.random() < 0.1,
      Fault_code: Math.random() < 0.1 ? Math.floor(Math.random() * 100) : 0,
      
      // Faults
      High_Pressure_Fault: Math.random() < 0.05,
      Low_Pressure_Fault: Math.random() < 0.05,
      Three_phase_monitor_fault: Math.random() < 0.02,
      Compressor_motor_overheat: Math.random() < 0.02,
      Anti_Freeze_Protection: Math.random() < 0.02,
      TH_Temp_more_than_50C: Math.random() < 0.02,
      
      // Sensor faults
      Ambient_Temp_Sensor_T2_1_Open: Math.random() < 0.01,
      Ambient_Temp_Sensor_T2_1_Short_Circuit: Math.random() < 0.01,
      Cold_Air_Temp_Sensor_T1_1_Open: Math.random() < 0.01,
      Cold_Air_Temp_Sensor_T1_1_Short_Circuit: Math.random() < 0.01,
      
      // Runtime
      Running_hours: 1248,
      Running_time_hour: 12,
      Running_time_minute: 34,
      Compressor_timer: 156,
      
      created_at: now.toISOString(),
    };
  };

  const generateTrendData = (): TrendData[] => {
    const data: TrendData[] = [];
    const now = new Date();
    
    for (let i = 24 * 60; i >= 0; i -= 5) { // 24 hours, every 5 minutes
      const timestamp = new Date(now.getTime() - i * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        ambient: 22 + Math.sin(i / 60) * 3 + Math.random() * 2,
        return: 18 + Math.sin(i / 60) * 2 + Math.random() * 1.5,
        supply: 12 + Math.sin(i / 60) * 1.5 + Math.random() * 1,
        afterHeater: 25 + Math.sin(i / 60) * 2.5 + Math.random() * 2,
        lpPressure: 2.1 + Math.sin(i / 120) * 0.3 + Math.random() * 0.2,
        hpPressure: 12.5 + Math.sin(i / 120) * 1 + Math.random() * 0.5,
        lpSetpoint: 2.0,
        hpSetpoint: 12.0,
        blowerSpeed: 65 + Math.sin(i / 90) * 10 + Math.random() * 5,
        condFanSpeed: 70 + Math.sin(i / 100) * 8 + Math.random() * 4,
        hotValveSpeed: 50 + Math.sin(i / 110) * 15 + Math.random() * 6,
        heaterSpeed: 25 + Math.sin(i / 130) * 10 + Math.random() * 3,
      });
    }
    
    return data;
  };

  const fetchData = async () => {
    try {
      // In production, replace with actual API calls
      // const response = await fetch('/api/dashboard/current');
      // const data = await response.json();
      
      const mockData = generateMockData();
      setCurrentData(mockData);
      setLastUpdated(new Date());
      
      if (isLoading) {
        const mockTrends = generateTrendData();
        setTrendData(mockTrends);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch latest data. Retrying...",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading industrial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header with KPIs */}
        <Header data={currentData} lastUpdated={lastUpdated} />
        
        {/* Status Tiles */}
        <StatusTiles data={currentData} />
        
        {/* Trend Panels */}
        <TrendPanels trendData={trendData} />
        
        {/* Alarms Section */}
        <AlarmsSection data={currentData} />
      </div>
      
      {/* Chatbot Panel */}
      <ChatbotPanel 
        isOpen={chatPanelOpen} 
        onToggle={() => setChatPanelOpen(!chatPanelOpen)}
      />
    </div>
  );
};