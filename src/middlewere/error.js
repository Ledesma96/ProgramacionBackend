import EErrors from "../services/error/enums.js";

export default (error, req, res, next) => {
    switch (error.doe) {
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.INTERNAL_SERVER_ERROR:
            return res.status(500).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.NOT_AUTHORIZED_ERROR :
            return res.status(401).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.NOT_ACCEPTABLE_ERROR :
            return res.status(406).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        default:
            return res.send({status: "error", error: "Unhandled error"})
    }
}