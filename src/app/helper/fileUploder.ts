import path from "path"
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import config from "../../config";
import fs from 'fs/promises';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })




const uploadToCloudinary = async(file: Express.Multer.File) => {
    // Configuration
    cloudinary.config({ 
        cloud_name: config.cloudinary.cloud_name, 
        api_key: config.cloudinary.api_key, 
        api_secret: config.cloudinary.api_secret
    });
    
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            file.path, {
                public_id: file.filename,
            }
        );
        
        // Delete the file from local storage after successful upload
        await fs.unlink(file.path);
        
        return uploadResult;
    } catch (error) {
        // Delete the file even if upload fails
        try {
            await fs.unlink(file.path);
        } catch (unlinkError) {
            console.log('Error deleting file:', unlinkError);
        }
        
        console.log('Upload error:', error);
        throw error; // Re-throw to handle in calling code
    }
}


export const fileUploder = {
    upload,
    uploadToCloudinary
}



/*


const uploadToCloudinary = async(file: Express.Multer.File) => {
    // Configuration
    cloudinary.config({ 
        cloud_name: config.cloudinary.cloud_name, 
        api_key: config.cloudinary.api_key, 
        api_secret: config.cloudinary.api_secret
    });
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           file.path, {
            public_id: file.filename,
        }
       )
       .catch((error) => {
           console.log(error);
       }); 
    return uploadResult
}


*/