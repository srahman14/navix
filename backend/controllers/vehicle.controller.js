import * as vehicleService from "../services/vehicle.service.js"

export const createVehicleController = (req, res) => {
    const vehicle = vehicleService.createVehicle(req.body);
    res.json(vehicle);
}

export const getVehiclesController = (req, res) => { 
    res.json(vehicleService.getVehicles())
}