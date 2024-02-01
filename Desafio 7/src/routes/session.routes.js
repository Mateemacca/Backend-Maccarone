import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";
import { generateToken } from "../config/jwt.config.js";
const sessionRoutes = Router();

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

sessionRoutes.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res) => {
    req.session.user = {
        first_name:req.user.first_name,
        last_name:req.user.last_name,
        age:req.user.age,
        email:req.user.email,
        role:req.user.role
    }

    res.redirect('/')
})


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

sessionRoutes.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}),
async (req,res)=>{
    
    if(!req.user){
        return res.status(400).send({message:'error with credentials'})
    }
    req.session.user = {
        first_name:req.user.first_name,
        last_name:req.user.last_name,
        age:req.user.age,
        email:req.user.email,
        role:req.user.role
    }
    res.redirect('/')
}
)
sessionRoutes.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res)=>{

})
sessionRoutes.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),(req,res)=>{
    req.session.user = req.user
    res.redirect('/')
})


sessionRoutes.post('/logout', async(req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({message: 'Logout failed'});
            }
        });
        res.send({redirect: 'http://localhost:8080/login'});
    } catch (error) {
        res.status(400).send({error});
    }
});
sessionRoutes.post('/restore-password', async (req,res)=>{
    const {email,password} = req.body
    try {
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(401).send({message:'Unauthorized'})
        }
        user.password = createHash(password);
        await user.save()
        
        res.send('<p>Password updated successfully<p> <a href="/login">volver a login</a>')
        
    } catch (error) {
    console.log(error)
    res.status(400).send({error})        
    }
})

export default sessionRoutes;