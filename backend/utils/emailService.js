import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: process.env.NODE_ENV === 'production', // Use TLS in production
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production', // Allow self-signed certs in dev
      },
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.text,
      text: options.text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Email could not be sent. Error: ${error.message}`);
  }
};

// Email Templates
const emailTemplates = {
  // Order confirmation email
  orderConfirmation: (order) => {
    const { _id, user, orderItems, shippingAddress, totalPrice, paymentMethod, deliveryDate } = order;

    // Format deliveryDate if exists
    const formattedDeliveryDate = deliveryDate
      ? new Date(deliveryDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To be confirmed';

    // Format items for email
    const itemsList = orderItems.map(item =>
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    return {
      subject: `Order Confirmation - The Cake Heaven #${_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8a4c1; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Thank You for Your Order!</h1>
          </div>

          <div style="padding: 20px; background-color: #ffffff;">
            <p>Dear ${user.name},</p>
            <p>We're thrilled to confirm your order. Below are the details:</p>

            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0;">Order Information</h3>
              <p><strong>Order Number:</strong> #${_id}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Expected Delivery Date:</strong> ${formattedDeliveryDate}</p>
            </div>

            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: left;">Quantity</th>
                  <th style="padding: 10px; text-align: left;">Price</th>
                  <th style="padding: 10px; text-align: left;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right; padding: 10px;"><strong>Total:</strong></td>
                  <td style="padding: 10px;"><strong>₹${totalPrice.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0;">Delivery Information</h3>
              <p><strong>Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}</p>
              <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
            </div>

            <p>If you have any questions about your order, please don't hesitate to <a href="${process.env.FRONTEND_URL}/contact" style="color: #f8a4c1;">contact us</a>.</p>

            <p style="margin-top: 30px;">Thank you for choosing The Cake Heaven!</p>
            <p>Warm regards,<br/>The Cake Heaven Team</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} The Cake Heaven. All rights reserved.</p>
            <p>This email was sent to you because you placed an order with us. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
        Thank You for Your Order!

        Dear ${user.name},

        We're thrilled to confirm your order. Below are the details:

        Order Information
        Order Number: #${_id}
        Order Date: ${new Date().toLocaleDateString()}
        Payment Method: ${paymentMethod}
        Expected Delivery Date: ${formattedDeliveryDate}

        Order Summary
        ${orderItems.map(item => `${item.name} - Qty: ${item.quantity} - Price: ₹${item.price.toFixed(2)} - Total: ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}

        Total: ₹${totalPrice.toFixed(2)}

        Delivery Information
        Address: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}
        Phone: ${shippingAddress.phone}

        If you have any questions about your order, please don't hesitate to contact us at ${process.env.FRONTEND_URL}/contact.

        Thank you for choosing The Cake Heaven!

        Warm regards,
        The Cake Heaven Team

        © ${new Date().getFullYear()} The Cake Heaven. All rights reserved.
        This email was sent to you because you placed an order with us. Please do not reply to this email.
      `,
    };
  },

  // Password reset email
  passwordReset: (resetToken, name) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return {
      subject: 'Password Reset - The Cake Heaven',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8a4c1; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Reset Your Password</h1>
          </div>

          <div style="padding: 20px; background-color: #ffffff;">
            <p>Hello ${name},</p>
            <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
            <p>Please click on the button below to reset your password. This link will be valid for 1 hour.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #f8a4c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>

            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>

            <p style="margin-top: 30px;">Best regards,<br/>The Cake Heaven Team</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} The Cake Heaven. All rights reserved.</p>
            <p>If you're having trouble clicking the reset button, copy and paste the URL below into your web browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      `,
      text: `
        Reset Your Password

        Hello ${name},

        You are receiving this email because you (or someone else) has requested a password reset for your account.

        Please click on the link below to reset your password. This link will be valid for 1 hour.

        ${resetUrl}

        If you didn't request this, please ignore this email and your password will remain unchanged.

        Best regards,
        The Cake Heaven Team

        © ${new Date().getFullYear()} The Cake Heaven. All rights reserved.
      `,
    };
  },

  // Welcome email after registration
  welcome: (name) => {
    return {
      subject: 'Welcome to The Cake Heaven!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8a4c1; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Welcome to The Cake Heaven!</h1>
          </div>

          <div style="padding: 20px; background-color: #ffffff;">
            <p>Dear ${name},</p>
            <p>Thank you for joining The Cake Heaven family! We're excited to have you as a member.</p>

            <p>With your new account, you can:</p>
            <ul style="padding-left: 20px;">
              <li>Order delicious cakes for any occasion</li>
              <li>Save your favorite items</li>
              <li>Track your orders</li>
              <li>Receive special offers and discounts</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/shop" style="background-color: #f8a4c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
            </div>

            <p>If you have any questions or need assistance, please don't hesitate to <a href="${process.env.FRONTEND_URL}/contact" style="color: #f8a4c1;">contact us</a>.</p>

            <p style="margin-top: 30px;">Sweet regards,<br/>The Cake Heaven Team</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} The Cake Heaven. All rights reserved.</p>
            <p>This email was sent to you because you registered with us. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
        Welcome to The Cake Heaven!

        Dear ${name},

        Thank you for joining The Cake Heaven family! We're excited to have you as a member.

        With your new account, you can:
        - Order delicious cakes for any occasion
        - Save your favorite items
        - Track your orders
        - Receive special offers and discounts

        Visit our shop now: ${process.env.FRONTEND_URL}/shop

        If you have any questions or need assistance, please don't hesitate to contact us.

        Sweet regards,
        The Cake Heaven Team

        © ${new Date().getFullYear()} The Cake Heaven. All rights reserved.
        This email was sent to you because you registered with us. Please do not reply to this email.
      `,
    };
  },

  // Order status update email
  orderStatusUpdate: (order, newStatus) => {
    return {
      subject: `Order Status Update - The Cake Heaven #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8a4c1; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Order Status Update</h1>
          </div>

          <div style="padding: 20px; background-color: #ffffff;">
            <p>Dear ${order.user.name},</p>
            <p>We're writing to inform you that the status of your order #${order._id} has been updated to: <strong>${newStatus}</strong>.</p>

            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order Number:</strong> #${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>New Status:</strong> ${newStatus}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/profile/orders/${order._id}" style="background-color: #f8a4c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Details</a>
            </div>

            <p>If you have any questions about your order, please don't hesitate to <a href="${process.env.FRONTEND_URL}/contact" style="color: #f8a4c1;">contact us</a>.</p>

            <p style="margin-top: 30px;">Thank you for choosing The Cake Heaven!</p>
            <p>Warm regards,<br/>The Cake Heaven Team</p>
          </div>

          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} The Cake Heaven. All rights reserved.</p>
            <p>This email was sent to you because you placed an order with us. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
        Order Status Update

        Dear ${order.user.name},

        We're writing to inform you that the status of your order #${order._id} has been updated to: ${newStatus}.

        Order Details
        Order Number: #${order._id}
        Order Date: ${new Date(order.createdAt).toLocaleDateString()}
        New Status: ${newStatus}

        View your order details here: ${process.env.FRONTEND_URL}/profile/orders/${order._id}

        If you have any questions about your order, please don't hesitate to contact us.

        Thank you for choosing The Cake Heaven!

        Warm regards,
        The Cake Heaven Team

        © ${new Date().getFullYear()} The Cake Heaven. All rights reserved.
        This email was sent to you because you placed an order with us. Please do not reply to this email.
      `,
    };
  },
};

export { sendEmail, emailTemplates };
