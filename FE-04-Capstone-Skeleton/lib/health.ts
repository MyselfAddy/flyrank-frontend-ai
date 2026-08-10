export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  environment: string;
  uptime: number;
}

const startTime = Date.now();

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    service: 'FE-04 Capstone Skeleton',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };
}
