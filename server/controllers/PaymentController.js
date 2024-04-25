const axios = require('axios');
const midtransClient = require('midtrans-client');
const { payment } = require('../helpers/mailer');
const { User } = require('../models');
const generateOrderID = () => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `DONATION-${timestamp}-${randomString}`;
};

class PaymentController {
  static async paymentData(req, res, next) {
    try {
      let data = req.body;

      if (data.donation === 0 || !data.donation || data.donation == null) {
        throw {
          name: 'invalidInput',
          message:
            'Please input any donation amount each value will be really appreaciated by us',
        };
      }
      let userId = req.user.id;
      let user = await User.findByPk(userId);

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let orderIdGenerate = generateOrderID();

      let parameter = {
        transaction_details: {
          order_id: orderIdGenerate,
          gross_amount: data.donation,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: data.name,
          email: user.email,
        },
        item_details: [
          {
            id: orderIdGenerate,
            price: data.donation,
            quantity: 1,
            name: 'Donation',
          },
        ],
      };

      const dataTransaction = await snap.createTransaction(parameter);
      const { redirect_url, token } = dataTransaction;
      payment(user.email, redirect_url); //ini untuk send email function
      res.status(200).json({
        link: redirect_url,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
