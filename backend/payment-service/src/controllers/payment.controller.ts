import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class PaymentController {
  private paymentService = new PaymentService();

  public createPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const intent = await this.paymentService.createPayment(req.user!.id, req.body);
      return created(res, intent, "Payment intent created successfully");
    } catch (err) {
      next(err);
    }
  };

  public getPaymentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const payment = await this.paymentService.getPaymentById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return ok(res, payment, "Payment retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Security warning: In production verify webhook signature!
      const { paymentId, status } = req.body;
      const payment = await this.paymentService.handleWebhook(paymentId, status);
      return ok(res, payment, "Webhook processed successfully");
    } catch (err) {
      next(err);
    }
  };
}
