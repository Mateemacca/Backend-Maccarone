import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import UserRepository from "../dao/repositories/session.repository.js";
import passport from "passport";
import UserDTO from "../dtos/user.dto.js";
import {
  generateResetPasswordToken,
  sendPasswordResetEmail,
  verifyResetPasswordToken,
} from "../utils/resetPasswordToken.js";

const userRepository = new UserRepository(userModel);

export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    const userDTO = new UserDTO(req.user);
    res.send({ user: userDTO });
  } else {
    res.status(401).json({ message: "Unauthenticated" });
  }
};

export const registerUser = (req, res) => {
  passport.authenticate("register", { failureRedirect: "/failregister" })(
    req,
    res,
    async () => {
      try {
        const user = await userRepository.registerUser(req.user);
        req.session.user = {
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
          role: user.role,
        };
        req.logger.info(`Usuario registrado con el mail: ${req.user.email}`);
        res.redirect("/");
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error al registrar el usuario" });
      }
    }
  );
};

export const loginUser = (req, res) => {
  passport.authenticate("login", { failureRedirect: "/faillogin" })(
    req,
    res,
    async () => {
      try {
        const user = await userRepository.loginUser(
          req.body.email,
          req.body.password
        );
        req.session.user = {
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
          role: user.role,
        };
        res.redirect("/");
      } catch (error) {
        req.logger.error("Error con las credenciales");
        res.status(400).send({ error: "Error con las credenciales" });
      }
    }
  );
};

export const logoutUser = async (req, res) => {
  try {
    await userRepository.logoutUser(req);
    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    console.error(error);
    req.logger.error("Error al cerrar sesion");
    res.status(500).send({ error: "Error al cerrar sesion" });
  }
};

export const restorePassword = async (req, res) => {
  const { email, newPassword, token } = req.body;
  try {
    if (token) {
      // Verificar el token y actualizar la contraseña
      const userId = await verifyResetPasswordToken(token);
      if (userId) {
        await userRepository.updatePassword(userId, newPassword);
        res.send(
          '<p>Contraseña actualizada correctamente</p> <a href="/login">volver a iniciar sesión</a>'
        );
      } else {
        res
          .status(400)
          .send("Token de restablecimiento de contraseña inválido o expirado.");
      }
    } else {
      // Generar un nuevo token y enviarlo por correo electrónico
      const resetPasswordToken = await generateResetPasswordToken(email);
      await sendPasswordResetEmail(email, resetPasswordToken);
      res.send(
        "<p>Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.</p>"
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al restaurar la contraseña" });
  }
};

export const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = passport.authenticate("github", {
  failureRedirect: "/login",
});

export const githubCallbackHandler = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  req.session.user = req.user;
  res.redirect("/");
};

// sessionRoutes.post('/register', async (req, res) => {
//     const { first_name, last_name, email, age, password } = req.body;
//     try {
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password)
//            }
//         const user = await userModel.create(newUser)
//         const accessToken = generateToken(newUser)
//         req.session.user = user;
//         res.redirect('/products');
//     } catch (error) {
//         console.error(error);
//         res.status(400).send({error});
//     }
// });
// sessionRoutes.post('/login', async(req, res) => {
//     const {email, password} = req.body;
//     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//         req.session.user = { role: 'admin' };
//         return res.redirect('/products');
//     }
//     try {
//         const user = await userModel.findOne({email});
//         if(!user|| !isValidPassword(user,password)){
//             return res.status(401).send({message: 'Not Authorized'});
//         }
//         user.password = '';
//         const accessToken = generateToken(user)
//         req.session.user = user;
//         res.redirect('/products');
//     } catch (error) {
//         res.status(400).send({error});
//     }
// });
