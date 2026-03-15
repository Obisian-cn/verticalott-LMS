import { Payment } from "../models";
import { Course } from "../models";
import { AppError } from "../utils/AppError";

export class PaymentService {
  public async createPayment(userId: string, data: any) {
    const course = await Course.findByPk(data.courseId);
    if (!course) throw new AppError("Course not found", 404);

    const payment = await Payment.create({
      userId,
      courseId: data.courseId,
      amount: data.amount,
      currency: data.currency || "USD",
      provider: data.provider,
      status: "pending",
    });

    // Dummy integration to start intent
    return {
      paymentId: payment.id,
      clientSecret: `pi_${payment.id}_secret`,
      status: payment.status
    };
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
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new AppError("Payment not found", 404);

    payment.status = status;
    await payment.save();

    // Here normally we would trigger an event or message to the enrollment service
    return payment;
  }
}
