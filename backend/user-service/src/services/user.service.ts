import bcrypt from "bcrypt";
import { User } from "../models";
import { AppError } from "../utils/AppError";

export class UserService {
  public async getUsers() {
    return await User.findAll({ attributes: { exclude: ["password"] } });
  }

  public async getUserById(id: string) {
    const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  public async updateUser(id: string, updateData: any) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError("User not found", 404);

    if (updateData.email) {
      const existing = await User.findOne({ where: { email: updateData.email } });
      if (existing && existing.id !== id) {
        throw new AppError("Email already in use", 409);
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);
    
    // Refresh the user without password
    return await User.findByPk(id, { attributes: { exclude: ["password"] } });
  }

  public async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError("User not found", 404);
    
    await user.destroy();
    return { success: true };
  }
}
