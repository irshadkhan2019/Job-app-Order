import Stripe from 'stripe';
import { Request, Response } from 'express';
import { config } from '@order/config';
import { StatusCodes } from 'http-status-codes';
import { orderSchema } from '@order/schemes/order';
import { BadRequestError, IOrderDocument } from '@irshadkhan2019/job-app-shared';
import { createOrder } from '@order/services/order.service';

// create stripe instance with api key
const stripe: Stripe = new Stripe(config.STRIPE_API_KEY!, {
  typescript: true
});

const intent = async (req: Request, res: Response): Promise<void> => {
    // create customer so that when a seller cancels his order an automic email will be send by stripe to buyer .
    // search if customer alredy exists https://docs.stripe.com/api/customers/search

  const customer: Stripe.Response<Stripe.ApiSearchResult<Stripe.Customer>> = await stripe.customers.search({
    query: `email:"${req.currentUser!.email}"`
  });

  let customerId = '';
//   after search if customer does not exist 
  if (customer.data.length === 0) {
    // create customer https://docs.stripe.com/api/customers/create
    const createdCustomer: Stripe.Response<Stripe.Customer> = await stripe.customers.create({
      email: `${req.currentUser!.email}`,
      metadata: {
        buyerId: `${req.body.buyerId}`
      }
    });
    customerId = createdCustomer.id;
  } else {
    // take customerid obtained from search
    customerId = customer.data[0].id;
  }
// create Intent map to customer
// https://docs.stripe.com/api/payment_intents/object
  let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
//   Need to send paymentIntent.id to client react app

  if (customerId) {
    // the service charge is 5.5% of the purchase amount
    // for purchases under $50, an additional $2 is applied
    const serviceFee: number = req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price;
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor((req.body.price + serviceFee) * 100), //in cents so x 100
      currency: 'usd',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

//  clientSecret  and id needed in front end to process payment
  res.status(StatusCodes.CREATED).json({
    message: 'Order intent created successfully.',
    clientSecret: paymentIntent!.client_secret,
    paymentIntentId: paymentIntent!.id
  });
};

// Once buyer makes payment we create order
const order = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create order() method');
  }
  const serviceFee: number = req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price;

  let orderData: IOrderDocument = req.body;

  orderData = { ...orderData, serviceFee };
  const order: IOrderDocument = await createOrder(orderData);
  res.status(StatusCodes.CREATED).json({ message: 'Order created successfully.', order });
};

export { intent, order };