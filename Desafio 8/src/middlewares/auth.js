export const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export const checkExistingUser = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
};


export const validateAdminCredentials = (req, res, next) => {
    const { email, password } = req.body

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { role: 'admin' }
        return res.redirect('/products');
    }
    return res.status(401).json({ message: 'Invalid admin credentials' });
};
