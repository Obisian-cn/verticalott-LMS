import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { updateUserSchema } from "../validations/user.validation";
import { authenticate } from "../middlewares/auth";

const router = Router();
const userController = new UserController();

router.get("/", authenticate, userController.getUsers);
router.get("/:id", authenticate, userController.getUserById);
router.patch("/:id", authenticate, validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

export default router;
