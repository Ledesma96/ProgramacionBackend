import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = req.body.fileType;

        let uploadPath = '';

        switch (fileType) {
            case 'profile':
                uploadPath = path.join(__dirname, 'public', 'profile');
                break;
            case 'products':
                uploadPath = path.join(__dirname, 'public', 'products');
                break;
            case 'documents':
                uploadPath = path.join(__dirname, 'public', 'documents');
                break;
            default:
                return cb(new Error('Invalid fileType'))
        }
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
});

const upload = multer({ storage: storage });

export { upload }