// Mock environment variables before importing service
jest.mock("../config/envVars.js", () => ({
  ENV_VARS: {
    ORS_API_URL_CAR: "https://api.openrouteservice.org/v2/directions/driving-car",
    ORS_API_KEY: "test-api-key",
  },
}));

import { fetchFromORS } from "../services/ors.service";
import { ENV_VARS } from "../config/envVars.js";

global.fetch = jest.fn();

describe("fetchFromORS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns routes data", async () => {
    // Mock the API response (geometry is a string from OSR API)
    const mockApiResponse = {
      bbox: [0, 0, 1, 1],

      metadata: {
      engine: {
          version: "8.0",
        },
      },

      routes: [
        {
          summary: {
            distance: 1200,
            duration: 300,
          },

          segments: [
            {
              distance: 1200,
              duration: 300,
              steps: [],
            },
          ],

          bbox: [0, 0, 1, 1],

          way_points: [0, 1],

          geometry: "mockEncodedPolyline",
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await fetchFromORS(
      "driving-car",
      [
        [51.5001, 0.1278],
        [51.5001, -0.07649],
      ],
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),

      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "test-api-key",
        },
        body: JSON.stringify({
          coordinates: [
            [51.5001, 0.1278],
            [51.5001, -0.07649],
          ],

          alternative_routes: {
            target_count: 3,
            weight_factor: 1.4,
            share_factor: 0.6,
          },
          elevation: false,
        }),
      }),
    );

    // Verify the transformed response structure
    expect(result.bbox).toEqual([0, 0, 1, 1]);
    expect(result.metadata).toEqual({ engine: { version: "8.0" } });
    expect(result.routes).toHaveLength(1);
    expect(result.routes[0].geometry).toEqual({
      encoded: "mockEncodedPolyline"
    });
  });

  it("throws when API fails", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(
      fetchFromORS(
        "driving-car",
        [
          [51.5001, 0.1278],
          [51.5001, -0.07649],
        ],
      ),
    ).rejects.toThrow("Failed to fetch data from OSR Internal Server Error");
  });
});
