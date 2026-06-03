import { createVehicle, getVehicles } from "../services/vehicle.service";

describe('vehicleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shuold return the newly created vehicle', () => {
        const data = {
            status: "active",
            orders: 1,
            startLocation: [
                51.5001,
                -0.1278
            ],
            load: 1000,
            orderId: "ORD-123"
        };

        const result = createVehicle(data);
        
        expect(result).toEqual({
            id: expect.any(String),
            ...data
        });

        const storedVehicles = getVehicles();
        expect(storedVehicles).toContainEqual(result);
        expect(storedVehicles.length).toBe(1);
    })
})