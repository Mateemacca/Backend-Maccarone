
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";

export const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthenticated' });
    }
};

export const registerUser = (req, res) => {
    passport.authenticate('register', { failureRedirect: '/failregister' })(req, res, () => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        };
        res.redirect('/');
    });
};

export const loginUser = (req, res) => {
    passport.authenticate('login', { failureRedirect: '/faillogin' })(req, res, () => {
        if (!req.user) {
            return res.status(400).send({ message: 'Error with credentials' });
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        };
        res.redirect('/');
    });
};

export const logoutUser = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout failed' });
            }
        });
        res.send({ redirect: 'http://localhost:8080/login' });
    } catch (error) {
        res.status(400).send({ error });
    }
};

export const restorePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        user.password = createHash(password);
        await user.save();
        res.send('<p>Password updated successfully<p> <a href="/login">volver a login</a>');
    } catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
};

// Importa passport y define las estrategias

export const githubLogin = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = passport.authenticate('github', { failureRedirect: '/login' });

// Maneja la lógica de redireccionamiento y asignación de sesión en una ruta separada
export const githubCallbackHandler = (req, res) => {
    // Maneja el fallo de autenticación
    if (!req.user) {
        return res.redirect('/login');
    }
    // Establece la sesión del usuario
    req.session.user = req.user;
    // Redirige a la página principal
    res.redirect('/');
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