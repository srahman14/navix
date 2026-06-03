// Temporary - in memory store (until DB)
let orders = []

export const createOrder = (data) => {
    const newOrder = {
        id: crypto.randomUUID(),
        ...data
    };

    orders.push(newOrder);
    return newOrder;
}

export const getOrders = () => orders;

