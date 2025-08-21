import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Thermometer, Gauge, Activity } from 'lucide-react';
import { DashboardData } from '../Dashboard';

interface HeaderProps {
  data: DashboardData | null;
  lastUpdated: Date | null;
}

export const Header = ({ data, lastUpdated }: HeaderProps) => {
  if (!data) return null;

  // Helper to convert string boolean to actual boolean
  const toBool = (value: string | boolean | null): boolean => {
    if (typeof value === 'boolean') return value;
    return value === 'True' || value === 'true' || value === '1';
  };

  // Calculate temperatures with fallbacks
  const ambient = data.T2_temp_mean ?? ((data.T2_1_ambient_temp ?? 0) + (data.T2_2_ambient_temp ?? 0)) / 2;
  const returnTemp = data.T1_temp_mean ?? ((data.T1_1_cold_air_temp ?? 0) + (data.T1_2_cold_air_temp ?? 0)) / 2;
  const supply = data.T0_temp_mean ?? ((data.T0_1_air_outlet_temp ?? 0) + (data.T0_2_air_outlet_temp ?? 0)) / 2;
  const afterHeater = data.TH_temp_mean ?? ((data.TH_1_supply_air_temp ?? 0) + (data.TH_2_supply_air_temp ?? 0)) / 2;
  const deltaT = returnTemp - supply;

  // Health status
  const isHealthy = toBool(data.Chiller_healthy_on_Q1_1) && 
                   !toBool(data.Chiller_Fault_on_Q2_0) && 
                   !toBool(data.Collective_Trouble_Signal_on_Q2_1);

  // Active modes
  const activeModes = [
    toBool(data.Auto_mode) && 'AUTO',
    toBool(data.Manual_mode) && 'MANUAL', 
    toBool(data.Aeration_mode) && 'AERATION',
    toBool(data.Continuous_mode) && 'CONTINUOUS'
  ].filter(Boolean);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour12: false 
    });
  };

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HVAC Unit Dashboard</h1>
          <p className="text-muted-foreground">PLC: S7-1200 | GTPL-114-GT-140E</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={isHealthy ? "default" : "destructive"}
            className={isHealthy ? "glow-success" : "glow-destructive"}
          >
            <Activity className="w-4 h-4 mr-1" />
            {isHealthy ? 'HEALTHY' : 'FAULT'}
          </Badge>
          {lastUpdated && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {formatTime(lastUpdated)} IST
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Temperature KPIs */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-chart-temp-ambient" />
              Ambient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-temp-ambient">
              {ambient?.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-chart-temp-return" />
              Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-temp-return">
              {returnTemp?.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-chart-temp-supply" />
              Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-temp-supply">
              {supply?.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="w-4 h-4 mr-2 text-chart-temp-heater" />
              After-heater
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-temp-heater">
              {afterHeater?.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ΔT Cooling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {deltaT?.toFixed(1)}°C
            </div>
            <p className="text-xs text-muted-foreground">Return - Supply</p>
          </CardContent>
        </Card>
      </div>

      {/* Pressure Gauges and Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LP Gauge */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-chart-pressure-lp" />
              Low Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-chart-pressure-lp">
                  {data.LP_value?.toFixed(2)} bar
                </div>
                <div className="text-sm text-muted-foreground">
                  Setpoint: {data.LP_set_point?.toFixed(1)} bar
                </div>
              </div>
              <Progress 
                value={Math.min(((data.LP_value ?? 0) / 5) * 100, 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* HP Gauge */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-chart-pressure-hp" />
              High Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-chart-pressure-hp">
                  {data.HP_value?.toFixed(2)} bar
                </div>
                <div className="text-sm text-muted-foreground">
                  Setpoint: {data.HP_set_point?.toFixed(1)} bar
                </div>
              </div>
              <Progress 
                value={Math.min(((data.HP_value ?? 0) / 25) * 100, 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Modes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Operating Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeModes.length > 0 ? (
                activeModes.map((mode, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 pulse-glow">
                    {mode}
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground">No active modes</div>
              )}
              
              <div className="pt-2 text-sm text-muted-foreground border-t border-border/50">
                <div>Runtime: {data.Running_time_hour}h {data.Running_time_minute}m</div>
                <div>Total Hours: {data.Running_hours?.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};