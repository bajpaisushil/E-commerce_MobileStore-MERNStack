const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { Order } = require("../models/orderModel");
const bodyParser = require("body-parser");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const shippingAddress = {
  country: "US",
  city: "San Francisco",
  state: "CA",
  postalCode: "94103",
  line1: "123 Main Street",
};

const billingAddress = shippingAddress;

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      // cart: JSON.stringify(req.body.cartItems),
    },
  });
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    // shipping: {
    //     address: shippingAddress,
    //   },
    //   billing: {
    //     address: billingAddress,
    //   },
  });

  res.send({ url: session.url });
});

const createOrder = async (customer, data, lineItems) => {
  // const Items = JSON.parse(customer.metadata.cart);
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    // products: Items,
    products: lineItems.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });
  try {
    const savedOrder = await newOrder.save();
    console.log("processed Order: ", savedOrder);
  } catch (error) {
    console.log(error);
  }
};

//stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "*/*" }), // Use raw middleware first
  express.json({ type: "application/json" }),
  // express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    // webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      console.log("Content-Type:", req.headers["content-type"]);
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      // if (data.customer) {
      //   stripe.customers
      //     .retrieve(data.customer)
      //     .then(async (customer) => {
      //       try {
      //         // CREATE ORDER
      //         createOrder(customer, data);
      //       } catch (err) {
      //         console.log(err.message);
      //       }
      //     })
      //     .catch((err) => console.log(err.message));
      // } else {
      //   console.log("No customer ID found in the event data.");
      // }
      stripe.customers.retrieve(data.customer)
      .then((customer)=>{
        stripe.checkout.sessions.listLineItems(
          data.id,
          {},
          function(err, lineItems){
            console.log('line_items: ', lineItems);
            createOrder(customer, data, lineItems);
          }
        )
      })
    }

    res.status(200).end();
  }
);

module.exports = router;
