
export const AdminMiddleware = async (req, res, next) => {

    try {

        const AdminRole = req.user.role;
        if (!AdminRole) {
            return res.status(403).json({ error: "Access denied. User is not Admin." });
        }
        // res.status(200).json({ msg: req.user.role });

        next();

    }
    catch (error) {
        return res.status(404).send({
            success: false,
            message: "Unauthorized User Request",
        });
    }


}

