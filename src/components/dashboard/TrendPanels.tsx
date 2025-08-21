import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { TrendData } from '../Dashboard';
import { Calendar, TrendingUp } from 'lucide-react';

interface TrendPanelsProps {
  trendData: TrendData[];
}

export const TrendPanels = ({ trendData }: TrendPanelsProps) => {
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-border/50 rounded-lg">
          <p className="text-sm font-medium text-foreground">
            {formatTime(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value?.toFixed(1)}{entry.unit || '°C'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Trend Analysis</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Badge variant="secondary">Last 24 Hours</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Temperature Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ambient" 
                  stroke="hsl(var(--chart-temp-ambient))" 
                  strokeWidth={2}
                  name="Ambient"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="return" 
                  stroke="hsl(var(--chart-temp-return))" 
                  strokeWidth={2}
                  name="Return"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="supply" 
                  stroke="hsl(var(--chart-temp-supply))" 
                  strokeWidth={2}
                  name="Supply"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="afterHeater" 
                  stroke="hsl(var(--chart-temp-heater))" 
                  strokeWidth={2}
                  name="After-heater"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pressure Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Pressure Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'bar', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* LP Pressure and Setpoint */}
                <Line 
                  type="monotone" 
                  dataKey="lpPressure" 
                  stroke="hsl(var(--chart-pressure-lp))" 
                  strokeWidth={2}
                  name="LP Pressure"
                  dot={false}
                />
                <ReferenceLine 
                  y={2.0} 
                  stroke="hsl(var(--chart-pressure-lp))" 
                  strokeDasharray="5 5"
                  label="LP Setpoint"
                />
                
                {/* HP Pressure and Setpoint */}
                <Line 
                  type="monotone" 
                  dataKey="hpPressure" 
                  stroke="hsl(var(--chart-pressure-hp))" 
                  strokeWidth={2}
                  name="HP Pressure"
                  dot={false}
                />
                <ReferenceLine 
                  y={12.0} 
                  stroke="hsl(var(--chart-pressure-hp))" 
                  strokeDasharray="5 5"
                  label="HP Setpoint"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actuator Output Trends */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Actuator Output Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="blowerSpeed" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Blower Speed"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="condFanSpeed" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Condenser Fan"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="hotValveSpeed" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="Hot Valve"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="heaterSpeed" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Heater"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};