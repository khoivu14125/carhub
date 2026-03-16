const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user đã được gán giá trị từ authMiddleware trước đó
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Quyền hạn '${req.user.role}' không thể thực hiện hành động này` 
            });
        }
        next();
    };
};

module.exports = { authorize };