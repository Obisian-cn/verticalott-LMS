import { Payment } from "../models";
import { Course, Enrollment, User } from "@lms/database";
import { AppError } from "../utils/AppError";
import axios from "axios";
import { config } from "../config";

const CASHFREE_API = config.cashfree.env === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

export class PaymentService {
  public async createPayment(userId: string, data: any) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("User not found", 404);

    const course = await Course.findByPk(data.courseId);
    if (!course) throw new AppError("Course not found", 404);

    const rawAmount = data.amount || course.price || 0;
    const amount = parseFloat(Number(rawAmount).toFixed(2));
    console.log("amount------->", amount, typeof amount);
    console.log("course.price------->", course.price, typeof course.price);
    console.log("data.amount------->", data.amount, typeof data.amount);

    if (!amount || amount <= 0) {
      throw new AppError("Invalid course price", 400);
    }
    const currency = data.currency || "INR"; // Default to INR for Cashfree

    const payment = await Payment.create({
      userId,
      courseId: data.courseId,
      amount: amount,
      currency: currency,
      provider: data.provider || "cashfree",
      status: "pending",
    });

    const orderId = `order_${payment.id}`;

    const requestBody = {
      order_amount: Number(amount),
      order_currency: currency,
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_phone: "9999999999", // Dummy phone as we don't have it
        customer_email: user.email || "test@example.com",
        customer_name: user.name || "User",
      },
      order_meta: {
        return_url: `${data.returnUrl || 'https://playstori.southindia.cloudapp.azure.com/lms-fre/payment/success'}?order_id={order_id}`,
        notify_url: config.cashfree.webhookUrl,
      }
    };

    console.log("return_url------->", data.returnUrl);
    console.log("full return_url------->", `${data.returnUrl || 'https://playstori.southindia.cloudapp.azure.com/lms-fre/payment/success'}?order_id={order_id}`);

    try {
      const response = await axios.post(`${CASHFREE_API}/orders`, requestBody, {
        headers: {
          "x-client-id": config.cashfree.appId,
          "x-client-secret": config.cashfree.secretKey,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json"
        }
      });

      return {
        paymentId: payment.id,
        orderId,
        paymentSessionId: response.data.payment_session_id,
        status: payment.status
      };
    } catch (e: any) {
      console.error("Cashfree ERror", e.response?.data || e.message);
      throw new AppError("Payment gateway error", 500);
    }
  }

  public async getPaymentById(id: string, userId: string, role: string) {

    const payment = await Payment.findByPk(id);
    if (!payment) throw new AppError("Payment not found", 404);

    if (role !== "admin" && payment.userId !== userId) {
      throw new AppError("Forbidden: Cannot access this payment", 403);
    }

    return payment;
  }

  public async handleWebhook(paymentId: string, status: "completed" | "failed") {
    const id = paymentId.replace("order_", ""); // ← fix UUID parsing
    const payment = await Payment.findByPk(id);
    if (!payment) throw new AppError("Payment not found", 404);

    payment.status = status;
    await payment.save();

    if (status === "completed") {
      try {
        await Enrollment.findOrCreate({
          where: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
          defaults: {
            userId: payment.userId,
            courseId: payment.courseId,
            paymentId: payment.id,
            status: "active",
            enrolledAt: new Date(),
          }
        });
      } catch (err: any) {
        console.error("Enrollment creation failed", err.message);
      }
    }

    return payment;
  }
}
