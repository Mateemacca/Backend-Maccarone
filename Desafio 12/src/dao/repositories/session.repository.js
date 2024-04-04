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
  async getUser(user) {
    try {
      const result = await this.dao.findOne({ email: user });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getUserById(id) {
    try {
      const result = await this.dao.findOne({ _id: id });
      return result;
    } catch (error) {
      console.error(error);
      return null;
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

  // async restorePassword(newPassword) {

  //   try {
  //     const user = await this.dao.findOne({ email });
  //     if (!user) {
  //       console.log("Usuario no encontrado");
  //     }
  //     if (isValidPassword(user, password)) {
  //       const samePassword = true;
  //       return res.render("restore-password", { samePassword });
  //     }
  //     user.password = createHash(newPassword);
  //     await user.save();
  //     return { message: "Contraseña restaurada con éxito" };
  //   } catch (error) {
  //     console.error("Error al restaurar la contraseña:", error);
  //     console.log("Error al restaurar la contraseña");
  //   }
  // }

  async updateUser(id, user) {
    try {
      const result = await this.dao.findOneAndUpdate(
        { _id: id },
        { $set: user }
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUserToken(token) {
    try {
      const result = await this.dao.findOne({ "tokenPassword.token": token });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
