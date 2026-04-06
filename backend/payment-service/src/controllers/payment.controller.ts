import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class PaymentController {
  private paymentService = new PaymentService();

  public createPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log("Auth Request User----->", req.user);
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
      // Cashfree webhook structure usually has data.order.order_id
      console.log("Cashfree Webhook body: ", req.body);
      
      const orderId = req.body?.data?.order?.order_id || req.body?.orderId || req.body?.paymentId;
      const paymentStatus = req.body?.data?.payment?.payment_status || req.body?.status;

      let mappedStatus: "completed" | "failed" | null = null;
      
      if (paymentStatus === "SUCCESS" || paymentStatus === "completed") {
        mappedStatus = "completed";
      } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED" || paymentStatus === "failed") {
        mappedStatus = "failed";
      }

      if (orderId && mappedStatus) {
        const payment = await this.paymentService.handleWebhook(orderId, mappedStatus);
        return ok(res, payment, "Webhook processed successfully");
      }
      
      return ok(res, {}, "Webhook received but not processed");
    } catch (err) {
      next(err);
    }
  };
}
