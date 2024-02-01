import passport from "passport";
import initialize  from "passport";
import local from "passport-local";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done )=>{
            const {first_name, last_name, email, age} = req.body;
            try {
                const user = await userModel.findOne({email:username})
                if (user){
                    console.log('User already exists')
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }

                const result = await userModel.create(newUser)
                req.session.user = newUser;
                return done(null,result)
            } catch (error) {
                    return done('Error finding user ' + error)
            }
        }
    ))
    passport.use('login', new LocalStrategy(
        {usernameField:'email'},
        async (username, password, done) =>{
            
            try {
                if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                    const adminUser = { email: 'adminCoder@coder.com', role: 'admin', first_name:'Administrator' };
                    return done(null, adminUser);
                }
    
        
                const user = await userModel.findOne({email:username});
                if(!user){
                    console.log('User does not exist');
                    return done(null,false)
                }
                if(!isValidPassword(user,password)){
                    return done(null,false)
                }
                return done(null,user)
            } catch (error) {
                return done(error)
            }
        }
    ))
    passport.use('github', new GithubStrategy(
        {
            clientID:"Iv1.35153beb2c98b929",
            callbackURL:"http://localhost:8080/api/session/githubcallback",
            clientSecret:"34b56679e8d99b4e4d2fe08fdf68e8a27c2502d4"
        },
        async (accessToken, refreshToken, profile, done) =>{
            try {
                const user = await userModel.findOne({email:profile.username})
                if(!user){
                    const newUser = {
                        first_name:profile._json.name.split(' ')[0],
                        last_name: profile._json.name.split(' ')[1],
                        age: 18,
                        email: profile.username,
                        password:'GithubGenerated'
                    }
                    const result = await userModel.create(newUser)
                     return done(null,result)
                }
                return done(null,user)
            } catch (error) {
                return done(error)                
            }
        } 
    ))    


    passport.serializeUser((user, done) => {
        if (user && user.email === 'adminCoder@coder.com') {
            done(null, new ObjectId('000000000000000000000000'));
        } else if (user && user._id) {
            done(null, user._id);
        } else {
            done(new Error('Invalid user'));
        }
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findOne({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

export default initializePassport