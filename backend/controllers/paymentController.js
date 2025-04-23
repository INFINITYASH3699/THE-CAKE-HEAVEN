import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Process Stripe payment
// @route   POST /api/payments/stripe
// @access  Private
const processStripePayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethodId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Verify the user is authorized to pay for this order
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }

  // If order is already paid
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe uses cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      description: `Payment for order ${order.orderNumber}`,
      receipt_email: req.user.email,
    });

    // Update order with payment details
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    // Add to order history
    order.statusHistory.push({
      status: order.status,
      date: new Date(),
      comment: "Payment completed via Stripe",
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      paymentIntent,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Create Stripe checkout session
// @route   POST /api/payments/stripe/checkout
// @access  Private
const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Verify the user is authorized
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  try {
    // Format line items for Stripe
    const lineItems = order.orderItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
            description: `Quantity: ${item.quantity}`,
          },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping cost as a line item
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: `${order.deliveryOption} shipping`,
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
            description: "Sales tax",
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    // Apply discount if any
    if (order.discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Discount",
            description: order.couponCode
              ? `Coupon: ${order.couponCode}`
              : "Discount",
          },
          unit_amount: -Math.round(order.discountAmount * 100), // negative for discount
        },
        quantity: 1,
      });
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: req.user.email,
      client_reference_id: order._id.toString(),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?id=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/stripe/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Make sure to get raw body in your server.js
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      // Check if the metadata contains an order ID
      if (session.metadata && session.metadata.orderId) {
        await handleSuccessfulPayment(session);
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Update payment status in DB if needed
      console.log("PaymentIntent was successful!");
      break;

    case "payment_intent.payment_failed":
      console.log("Payment failed!");
      break;

    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

// Helper function to handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    // Get the order ID from session metadata
    const orderId = session.metadata.orderId;

    // Find order and update payment status
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: session.id,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: session.customer_email,
      };

      // Add entry to status history
      order.statusHistory.push({
        status: order.status,
        date: new Date(),
        comment: "Payment completed via Stripe checkout",
      });

      await order.save();
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

export { processStripePayment, createStripeCheckoutSession, stripeWebhook };
