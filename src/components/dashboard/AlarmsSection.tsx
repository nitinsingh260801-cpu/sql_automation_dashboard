import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  AlertCircle, 
  Thermometer, 
  Gauge, 
  Zap,
  WifiOff,
  ExternalLink
} from 'lucide-react';
import { DashboardData } from '../Dashboard';

interface AlarmsSectionProps {
  data: DashboardData | null;
}

interface AlarmItem {
  name: string;
  severity: 'critical' | 'warning' | 'info';
  active: boolean;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
}

export const AlarmsSection = ({ data }: AlarmsSectionProps) => {
  if (!data) return null;

  // Helper to convert string boolean to actual boolean
  const toBool = (value: string | boolean | null): boolean => {
    if (typeof value === 'boolean') return value;
    return value === 'True' || value === 'true' || value === '1';
  };

  // Define all possible alarms
  const allAlarms: AlarmItem[] = [
    // Critical Process Alarms
    {
      name: 'High Pressure Fault',
      severity: 'critical',
      active: toBool(data.High_Pressure_Fault),
      icon: Gauge,
      description: 'System pressure exceeds safe operating limits',
      category: 'Process'
    },
    {
      name: 'Low Pressure Fault', 
      severity: 'critical',
      active: toBool(data.Low_Pressure_Fault),
      icon: Gauge,
      description: 'System pressure below minimum operating threshold',
      category: 'Process'
    },
    {
      name: 'Compressor Motor Overheat',
      severity: 'critical',
      active: toBool(data.Compressor_motor_overheat),
      icon: Thermometer,
      description: 'Compressor motor temperature exceeds safety limit',
      category: 'Equipment'
    },
    {
      name: 'Anti Freeze Protection',
      severity: 'warning',
      active: toBool(data.Anti_Freeze_Protection),
      icon: Thermometer,
      description: 'Anti-freeze protection system activated',
      category: 'Safety'
    },
    {
      name: 'After-heater Overtemp',
      severity: 'warning',
      active: toBool(data.TH_Temp_more_than_50C),
      icon: Thermometer,
      description: 'After-heater temperature above 50°C',
      category: 'Process'
    },
    {
      name: 'Three Phase Monitor',
      severity: 'critical',
      active: toBool(data.Three_phase_monitor_fault),
      icon: Zap,
      description: 'Phase monitoring system detected fault',
      category: 'Electrical'
    },
    
    // Sensor Faults
    {
      name: 'T2.1 Sensor Open',
      severity: 'warning',
      active: toBool(data.Ambient_Temp_Sensor_T2_1_Open),
      icon: WifiOff,
      description: 'Ambient temperature sensor T2.1 open circuit',
      category: 'Sensor'
    },
    {
      name: 'T2.1 Sensor Short',
      severity: 'warning', 
      active: toBool(data.Ambient_Temp_Sensor_T2_1_Short_Circuit),
      icon: WifiOff,
      description: 'Ambient temperature sensor T2.1 short circuit',
      category: 'Sensor'
    },
    {
      name: 'T1.1 Sensor Open',
      severity: 'warning',
      active: toBool(data.Cold_Air_Temp_Sensor_T1_1_Open),
      icon: WifiOff,
      description: 'Cold air temperature sensor T1.1 open circuit',
      category: 'Sensor'
    },
    {
      name: 'T1.1 Sensor Short',
      severity: 'warning',
      active: toBool(data.Cold_Air_Temp_Sensor_T1_1_Short_Circuit),
      icon: WifiOff,
      description: 'Cold air temperature sensor T1.1 short circuit',
      category: 'Sensor'
    }
  ];

  // System-level alarms
  const systemAlarms: AlarmItem[] = [
    {
      name: 'Chiller Fault',
      severity: 'critical',
      active: toBool(data.Chiller_Fault_on_Q2_0),
      icon: AlertTriangle,
      description: 'General chiller fault detected',
      category: 'System'
    },
    {
      name: 'Collective Trouble Signal',
      severity: 'critical', 
      active: toBool(data.Collective_Trouble_Signal_on_Q2_1),
      icon: AlertTriangle,
      description: 'Multiple system faults detected',
      category: 'System'
    }
  ];

  // Combine all alarms
  const combinedAlarms = [...systemAlarms, ...allAlarms];
  
  // Filter active alarms
  const activeAlarms = combinedAlarms.filter(alarm => alarm.active);
  
  // Group alarms by category
  const alarmsByCategory = activeAlarms.reduce((acc, alarm) => {
    if (!acc[alarm.category]) {
      acc[alarm.category] = [];
    }
    acc[alarm.category].push(alarm);
    return acc;
  }, {} as Record<string, AlarmItem[]>);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Alarms & Faults</h2>
        <Badge variant={activeAlarms.length > 0 ? "destructive" : "secondary"}>
          {activeAlarms.length} Active
        </Badge>
      </div>

      {/* Active Alarms Banner */}
      {activeAlarms.length > 0 && (
        <Alert variant="destructive" className="glow-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>SYSTEM ALERT:</strong> {activeAlarms.length} active alarm(s) detected. 
            Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* No Alarms State */}
      {activeAlarms.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="text-success text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-success mb-2">All Systems Normal</h3>
            <p className="text-muted-foreground">No active alarms or faults detected</p>
          </CardContent>
        </Card>
      )}

      {/* Active Alarms by Category */}
      {Object.entries(alarmsByCategory).map(([category, alarms]) => (
        <Card key={category} className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category} Alarms</span>
              <Badge variant="outline">{alarms.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alarms.map((alarm, index) => {
                const IconComponent = alarm.icon;
                const SeverityIcon = getSeverityIcon(alarm.severity);
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{alarm.name}</h4>
                          <SeverityIcon className="w-4 h-4 text-destructive" />
                        </div>
                        <p className="text-sm text-muted-foreground">{alarm.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(alarm.severity)}>
                        {alarm.severity.toUpperCase()}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Fault Code Information */}
      {data.Fault_code && data.Fault_code > 0 && (
        <Card className="glass-card border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">System Fault Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive mb-2">
                Code: {data.Fault_code}
              </div>
              <p className="text-muted-foreground">
                Refer to system documentation for detailed fault analysis
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {combinedAlarms.filter(a => a.severity === 'critical').length}
              </div>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {combinedAlarms.filter(a => a.severity === 'warning').length}
              </div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {data.Running_hours?.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Runtime Hours</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {toBool(data.Chiller_healthy_on_Q1_1) ? '✓' : '✗'}
              </div>
              <p className="text-sm text-muted-foreground">Health Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};