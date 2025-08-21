import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Fan, 
  Zap, 
  Thermometer, 
  Wind, 
  Settings,
  Timer
} from 'lucide-react';
import { DashboardData } from '../Dashboard';

interface StatusTilesProps {
  data: DashboardData | null;
}

export const StatusTiles = ({ data }: StatusTilesProps) => {
  if (!data) return null;

  // Helper to convert string boolean to actual boolean
  const toBool = (value: string | boolean | null): boolean => {
    if (typeof value === 'boolean') return value;
    return value === 'True' || value === 'true' || value === '1';
  };

  const equipmentStatus = [
    {
      name: 'Compressor',
      icon: Zap,
      isOn: toBool(data.Compressor_on_Q0_4),
      value: data.Compressor_timer,
      unit: 'min',
      description: 'Compressor Timer'
    },
    {
      name: 'Blower',
      icon: Fan,
      isOn: toBool(data.Blower_drive_on_Q0_0),
      value: data.Blower_speed,
      unit: '%',
      description: 'Speed Control'
    },
    {
      name: 'Condenser Fan',
      icon: Wind,
      isOn: toBool(data.Condenser_fan_drive_on_Q0_3),
      value: data.Cond_fan_speed,
      unit: '%',
      description: 'Fan Speed'
    },
    {
      name: 'Hot Gas Valve',
      icon: Settings,
      isOn: toBool(data.Hot_gas_valve_on_Q0_7),
      value: data.Hot_valve_speed,
      unit: '%',
      description: 'Valve Position'
    },
    {
      name: 'AHT Valve',
      icon: Settings,
      isOn: true, // No specific digital output for this
      value: data.AHT_vale_speed,
      unit: '%',
      description: 'Valve Position'
    },
    {
      name: 'Heater',
      icon: Thermometer,
      isOn: toBool(data.Heater_drive_on_Q0_2),
      value: data.Heater_speed,
      unit: '%',
      description: 'Output Power'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Equipment Status</h2>
      
      <div className="data-grid">
        {equipmentStatus.map((equipment, index) => {
          const IconComponent = equipment.icon;
          const isActive = equipment.isOn;
          
          return (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="w-5 h-5 mr-2" />
                    {equipment.name}
                  </div>
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? "status-on" : "status-off"}
                  >
                    {isActive ? 'ON' : 'OFF'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {equipment.value?.toFixed(1) ?? '--'}{equipment.unit}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {equipment.description}
                    </p>
                  </div>
                  
                  {equipment.unit === '%' && equipment.value && (
                    <Progress 
                      value={Math.min(equipment.value, 100)}
                      className="h-2"
                    />
                  )}
                  
                  {equipment.unit === 'min' && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Timer className="w-4 h-4 mr-1" />
                      Running Timer
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Setpoints Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">Temperature Setpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">T1 Setpoint (Return)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-chart-temp-return">
                {data.T1_set_point?.toFixed(1)}°C
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">TH-T1 Setpoint (After-heater)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-chart-temp-heater">
                {data.TH_T1_set_point?.toFixed(1)}°C
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};