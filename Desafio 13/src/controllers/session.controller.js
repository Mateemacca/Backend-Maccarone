import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import MailingService from "../services/mailing.js";
import UserRepository from "../dao/repositories/session.repository.js";
import passport from "passport";
import UserDTO from "../dtos/user.dto.js";
import { generateToken, verifyToken } from "../utils/crypto.js";

const userRepository = new UserRepository(userModel);
const mailingService = new MailingService();

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

export const passwordForbidden = async (req, res) => {
  try {
    const { email } = req.body;
    const tokenObj = generateToken();
    console.log(tokenObj);
    const user = await userRepository.getUser(email);
    await userRepository.updateUser(user._id, { tokenPassword: tokenObj });
    await mailingService.sendSimpleMail({
      from: "NodeMailer Contant",
      to: email,
      subject: "Cambiar contraseña",
      html: `
                <h1>Hola!!</h1>
                <p>Haz clic en este <a href="http://localhost:8080/api/session/restore-password/${tokenObj.token}">enlace</a> para restablecer tu contraseña.</p>
            `,
    });
    const emailSend = true;
    req.logger.info(`Email sent to ${email}`);
    res.render("forgot-password", { emailSend });
  } catch (error) {
    req.logger.error(error);
    res.status(400).send({ error });
  }
};

export const restorePasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userRepository.getUserToken(token);
    if (!user) {
      const newTitle = true;
      return res.render("forgot-password", { newTitle });
    }
    const tokenObj = user.tokenPassword;
    if (tokenObj && verifyToken(tokenObj)) {
      res.redirect("/restore-password");
    } else {
      const newTitle = true;
      res.render("forgot-password", { newTitle });
    }
  } catch (error) {
    req.logger.error(error);
    res.status(400).send({ error });
  }
};

// export const restorePassword = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     await userRepository.restorePassword(email, password);

//     res.send(
//       '<p>Contraseña actualizada correctamente</p> <a href="/login">volver a iniciar sesion</a>'
//     );
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Error al restaurar la contraseña" });
//   }
// };
export const restorePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userRepository.getUser(email);
    if (!user) {
      req.logger.error("Unauthorized");
      return res.status(401).send({ message: "Unauthorized" });
    }
    if (isValidPassword(user, password)) {
      const samePassword = true;
      return res.render("restore-password", { samePassword });
    }
    user.password = createHash(password);
    await user.save();
    req.logger.info("Password saved");
    res.send(
      '<p>Contraseña actualizada correctamente</p> <a href="/login">volver a iniciar sesion</a>'
    );
  } catch (error) {
    req.logger.error(error);
    res.status(400).send({ error });
  }
};

export const changeRole = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userRepository.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // cambiar el rol del usuario
    user.role = user.role === "user" ? "premium" : "user";
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Error updating user role" });
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
