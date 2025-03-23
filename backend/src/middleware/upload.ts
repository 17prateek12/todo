import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb){
        cb(null, uploadDir);
    },
    filename: function (req: Request, file:Express.Multer.File, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) =>{
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({storage, fileFilter});

export default upload;