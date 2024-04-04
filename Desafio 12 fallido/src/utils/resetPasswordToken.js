import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { userModel } from "../dao/models/user.model.js";

export const generateResetPasswordToken = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const token = jwt.sign({ userId: user._id }, config.secret, {
    expiresIn: "1h",
  });
  return token;
};

export const verifyResetPasswordToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.secret);
    return decoded.userId;
  } catch (error) {
    console.error(
      "Error al verificar el token de restablecimiento de contraseña:",
      error
    );
    return null;
  }
};

export const sendPasswordResetEmail = async (email, resetPasswordToken) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "mateobauti.maccarone@gmail.com", // Reemplaza con tu dirección de correo electrónico
      pass: config.googlePassword, // Reemplaza con tu contraseña de correo electrónico
    },
  });

  try {
    const result = await transport.sendMail({
      from: "Ecommerce <prueba@gmail.com>",
      to: email,
      subject: "Restablecer contraseña",
      html: `
                <p>Hola,</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <a href="http://localhost:8080/reset-password?token=${resetPasswordToken}">Restablecer contraseña</a>
                <p>El enlace expirará en 1 hora.</p>
            `,
    });
    console.log(
      "Correo electrónico de restablecimiento de contraseña enviado:",
      result
    );
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de restablecimiento de contraseña:",
      error
    );
    throw new Error(
      "No se pudo enviar el correo electrónico de restablecimiento de contraseña"
    );
  }
};
