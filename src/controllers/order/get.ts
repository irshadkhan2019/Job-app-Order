import { IOrderDocument } from '@irshadkhan2019/job-app-shared';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { getOrderByOrderId, getOrdersByBuyerId, getOrdersBySellerId } from '@order/services/order.service';

// getOrderByOrderId
const orderId = async (req: Request, res: Response): Promise<void> => {
  const order: IOrderDocument = await getOrderByOrderId(req.params.orderId);
  res.status(StatusCodes.OK).json({ message: 'Order by order id', order });
};

// getOrdersBySellerId
const sellerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersBySellerId(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller orders', orders });
};

// getOrdersByBuyerId
const buyerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersByBuyerId(req.params.buyerId);
  res.status(StatusCodes.OK).json({ message: 'Buyer orders', orders });
};

export {
  orderId,
  sellerOrders,
  buyerOrders
};