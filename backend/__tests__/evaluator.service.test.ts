import { getMetricsFromRoutes } from '../services/evaluator.service';

describe('getMetricsFromRoutes', () => {
  
  describe('Single Route', () => {
    it('should calculate metrics correctly for a single route', async () => {
      const mockRoute = {
        summary: {
          distance: 5000,      
          duration: 300,       
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('distance');
      expect(result[0]).toHaveProperty('duration');
      expect(result[0]).toHaveProperty('startTime');
      expect(result[0]).toHaveProperty('arrivalTime');
    });

    it('should format distance correctly', async () => {
      const mockRoute = {
        summary: {
          distance: 5000,      
          duration: 300,
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      expect(result[0].distance).toBe('5.00 km');
    });

    it('should format duration correctly', async () => {
      const mockRoute = {
        summary: {
          distance: 5000,
          duration: 300,       
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      expect(result[0].duration).toBe('5 min');
    });

    it('should return valid time strings for startTime and arrivalTime', async () => {
      const mockRoute = {
        summary: {
          distance: 10000,
          duration: 600,       
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      const timeRegex = /^\d{2}:\d{2}$/; // Format: "21:10" (HH:MM)
      
      expect(result[0].startTime).toMatch(timeRegex);
      expect(result[0].arrivalTime).toMatch(timeRegex);
    });

    it('should have arrivalTime after startTime by duration seconds', async () => {
      const mockRoute = {
        summary: {
          distance: 8000,
          duration: 480,       
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      const startTime = new Date(`2000-01-01 ${result[0].startTime}`);
      const arrivalTime = new Date(`2000-01-01 ${result[0].arrivalTime}`);
      
      // Should be approximately 480 seconds apart
      const timeDiff = (arrivalTime.getTime() - startTime.getTime()) / 1000;
      expect(Math.abs(timeDiff - 480)).toBeLessThan(1); // Allow 1 second tolerance
    });
  });

  describe('Multiple Routes', () => {
    it('should handle multiple routes as array input', async () => {
      const mockRoutes = [
        { summary: { distance: 5000, duration: 300 } },
        { summary: { distance: 6000, duration: 350 } },
        { summary: { distance: 4500, duration: 280 } },
      ];
      
      const result = await getMetricsFromRoutes(mockRoutes);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      result.forEach(metrics => {
        expect(metrics).toHaveProperty('distance');
        expect(metrics).toHaveProperty('duration');
        expect(metrics).toHaveProperty('startTime');
        expect(metrics).toHaveProperty('arrivalTime');
      });
    });

    it('should return correct metrics for each route', async () => {
      const mockRoutes = [
        { summary: { distance: 5000, duration: 300 } },
        { summary: { distance: 10000, duration: 600 } },
      ];
      
      const result = await getMetricsFromRoutes(mockRoutes);
      
      expect(result[0].distance).toBe('5.00 km');
      expect(result[0].duration).toBe('5 min');
      expect(result[1].distance).toBe('10.00 km');
      expect(result[1].duration).toBe('10 min');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short routes', async () => {
      const mockRoute = {
        summary: {
          distance: 100,      
          duration: 30,        
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      expect(result[0].distance).toBe('0.10 km');
      expect(result[0].duration).toBe('0 min');
    });

    it('should handle very long routes', async () => {
      const mockRoute = {
        summary: {
          distance: 500000,  
          duration: 18000,     
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      expect(result[0].distance).toBe('500.00 km');
      expect(result[0].duration).toBe('300 min');
    });

    it('should handle zero distance and duration', async () => {
      const mockRoute = {
        summary: {
          distance: 0,
          duration: 0,
        }
      };
      
      const result = await getMetricsFromRoutes(mockRoute);
      expect(result[0].distance).toBe('0.00 km');
      expect(result[0].duration).toBe('0 min');
    });
  });

  describe('Error Handling', () => {
    it('should throw error if summary is missing', async () => {
      const mockRoute = {
        geometry: 'encoded_geometry'
      };
      
      await expect(getMetricsFromRoutes(mockRoute as any)).rejects.toThrow(
        'Route must have summary with distance and duration'
      );
    });

    it('should throw error if distance is missing', async () => {
      const mockRoute = {
        summary: {
          duration: 300,
        }
      };
      
      await expect(getMetricsFromRoutes(mockRoute as any)).rejects.toThrow(
        'Route must have summary with distance and duration'
      );
    });

    it('should throw error if duration is missing', async () => {
      const mockRoute = {
        summary: {
          distance: 5000,
        }
      };
      
      await expect(getMetricsFromRoutes(mockRoute as any)).rejects.toThrow(
        'Route must have summary with distance and duration'
      );
    });
  });
});
