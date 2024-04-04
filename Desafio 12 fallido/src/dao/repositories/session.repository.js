import { isValidPassword, createHash } from "../../utils/bcrypt.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getCurrentUser() {
    try {
      return await this.dao.findOne();
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      console.log("Error al obtener el usuario actual");
    }
  }

  async registerUser(user) {
    try {
      return await this.dao.create(user);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      console.log("Error al registrar el usuario");
    }
  }

  async loginUser(email, password) {
    try {
      const user = await this.dao.findOne({ email });
      if (!user || !isValidPassword(user, password)) {
        console.log("Credenciales inválidas");
      }
      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      console.log("Error al iniciar sesión");
    }
  }

  async logoutUser(req) {
    try {
      await req.session.destroy();
      return { message: "Logout exitoso" };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      console.log("Error al cerrar sesión");
    }
  }

  async restorePassword(email, newPassword) {
    try {
      const user = await this.dao.findOne({ email });
      if (!user) {
        console.log("Usuario no encontrado");
      }
      user.password = createHash(newPassword);
      await user.save();
      return { message: "Contraseña restaurada con éxito" };
    } catch (error) {
      console.error("Error al restaurar la contraseña:", error);
      console.log("Error al restaurar la contraseña");
    }
  }
  async updatePassword(userId, newPassword) {
    try {
      const user = await this.dao.findById(userId);
      if (!user) {
        console.log("Usuario no encontrado");
        return null;
      }
      user.password = createHash(newPassword);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      return null;
    }
  }
}
