import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../middlewares/validate";
import { createPaymentSchema, webhookSchema } from "../validations/payment.validation";
import { authenticate } from "../middlewares/auth";

const router = Router();
const paymentController = new PaymentController();

// POST /payments/create
router.post("/create", authenticate, validate(createPaymentSchema), paymentController.createPayment);

// POST /payments/webhook  (unauthenticated from Stripe/PayPal, but schema validated here)
router.post("/webhook", validate(webhookSchema), paymentController.webhook);

// GET /payments/:id
router.get("/:id", authenticate, paymentController.getPaymentById);

export default router;
