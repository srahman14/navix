import * as orderService from "../services/order.service.js"

export const createOrderController = (req, res) => {
    const order = orderService.createOrder(req.body);
    res.json(order);
}

export const getOrdersController = (req, res) => { 
    res.json(orderService.getOrders())
}