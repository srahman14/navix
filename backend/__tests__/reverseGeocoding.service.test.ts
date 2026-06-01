import { reverseGeocode } from '../services/reverseGeocoding.service';

global.fetch = jest.fn();

describe('reverseGeocode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return location details for valid coordinates', async () => {
    const mockResponse = {
      address: {
        city: 'London',
        state: 'England',
        country: 'United Kingdom',
      },
      display_name: 'London, England, United Kingdom',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await reverseGeocode(51.5074, -0.1278);

    expect(result).toEqual({
      locality: 'London',
      region: 'England',
      country: 'United Kingdom',
      display_name: 'London, England, United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?lat=51.5074&lon=-0.1278&format=json',
      {
        headers: {
          "User-Agent": "Navix Route Optimizer"
        }
      }
    );
  });

  it('should use town if city is not available', async () => {
    const mockResponse = {
      address: {
        town: 'Oxford',
        state: 'England',
        country: 'United Kingdom',
      },
      display_name: 'Oxford, England, United Kingdom',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await reverseGeocode(51.7520, -1.2577);

    expect(result.locality).toBe('Oxford');
  });

  it('should use village if city and town are not available', async () => {
    const mockResponse = {
      address: {
        village: 'Smalltown',
        county: 'Hampshire',
        country: 'United Kingdom',
      },
      display_name: 'Smalltown, Hampshire, United Kingdom',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await reverseGeocode(51.2, -1.5);

    expect(result.locality).toBe('Smalltown');
    expect(result.region).toBe('Hampshire');
  });

  it('should throw error if latitude or longitude is missing', async () => {
    await expect(reverseGeocode(null as any, -0.1278)).rejects.toThrow(
      'Latitude and longitude are required'
    );

    await expect(reverseGeocode(51.5074, null as any)).rejects.toThrow(
      'Latitude and longitude are required'
    );
  });

  it('should throw error if API response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(reverseGeocode(999, 999)).rejects.toThrow(
      'Nominatim API failed with status 404'
    );
  });

  it('should throw error if no address in response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ display_name: 'Something' }),
    });

    await expect(reverseGeocode(51.5074, -0.1278)).rejects.toThrow(
      'No address found for coordinates'
    );
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(reverseGeocode(51.5074, -0.1278)).rejects.toThrow(
      'Network error'
    );
  });
});
