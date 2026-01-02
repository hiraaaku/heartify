import { useEffect, useState, useRef } from 'react';

export interface RealtimeData {
  ecg_value: number;
  pcg_value: number;
  heart_rate: number;
  status: string;
  timestamp: string;
}

export function useRealtimeData(patientId?: number) {
  const [ecgData, setEcgData] = useState<number[]>([]);
  const [pcgData, setPcgData] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState(0);
  const [status, setStatus] = useState('Normal');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Reset data when patientId changes
    setEcgData([]);
    setPcgData([]);
    setHeartRate(0);
    setStatus('Normal');
    setIsConnected(false);

    if (!patientId) return;

    const wsUrl = `wss://api.diniweb.site/ws/live/${patientId}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'new_recording') {
          const data = message.data as RealtimeData;
          // Keep last 100 data points for the chart
          setEcgData((prev: number[]) => {
            const newData = [...prev, data.ecg_value];
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
          });
          setPcgData((prev: number[]) => {
            const newData = [...prev, data.pcg_value];
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
          });
          setHeartRate(data.heart_rate);
          setStatus(data.status);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    // Keep alive ping every 25 seconds
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [patientId]);

  return { ecgData, pcgData, heartRate, status, isConnected };
}
