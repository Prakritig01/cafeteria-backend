function checkRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized access!" });
        }
        next();
    };
}

function authCounter(req, res, next) {
    if (!req.counter.merchants.includes(req.user._id)) {
        return res.status(403).json({ message: "Unauthorized access!" });
    }
    next();
}

module.exports = {
    checkRole,
    authCounter,
};