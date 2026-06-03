import { createOrder, getOrders } from "../services/order.service";

describe('orderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shuold return the newly created order', () => {
        const data = {
            priority: "high",
            weight: 1000,
            location: [51.5001, -0.1278]
        };

        const result = createOrder(data);
        
        expect(result).toEqual({
            id: expect.any(String),
            ...data
        });

        const storedOrder = getOrders();
        expect(storedOrder).toContainEqual(result);
        expect(storedOrder.length).toBe(1);
    })
})