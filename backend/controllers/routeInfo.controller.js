import * as routeInfoService from "../services/routeInfo.service.js"

export const createRouteInfoController = (req, res) => {
    const routeInfo = routeInfoService.createRouteInfo(req.body);
    res.json(routeInfo);
}

export const getRouteInfoController = (req, res) => { 
    res.json(routeInfoService.getRouteInfo())
}