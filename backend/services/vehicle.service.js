// Temporary - in memory store (until DB)
let vehicles = []

export const createVehicle = (data) => {
    const newVehicle = {
        id: crypto.randomUUID(),
        ...data
    };

    vehicles.push(newVehicle);
    return newVehicle;
}

export const getVehicles = () => vehicles;