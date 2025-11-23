import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import {Readable} from "stream"

dotenv.config();

export const uploadToCloudinary = async (fileBuffer, title) => {
    // cloudinary config
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SEC
    });

    // ping to check whether cloudinary is working or not
    await cloudinary.api.ping((error, result) => {
        if (error) {
            console.error("Cloudinary configuration error:", error);
        } else {
            console.log("Cloudinary configuration successful:", result);
        }
    });
    // https://cloudinary.com/blog/guest_post/media-uploads-with-cloudinarys-upload-functions
    return new Promise ((resolve, reject)=> {
        const uploadedImage = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                public_id: `screenshots/${title.trim()}`,
                display_name: title,
                overwrite: false,
                media_metadata: true,
            },
            (err, result) => {
                if (err) {
                    console.log('Error uploading image to server', err)
                    return reject(err)
                }
                else {
                    console.log(result)
                    console.log('Image uploaded successfully', result.secure_url)
                    resolve(result)
                }

            }
        )
        let str = Readable.from(fileBuffer)
        str.pipe(uploadedImage)
    })
}