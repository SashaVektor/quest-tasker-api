import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import multer from 'multer';
import { isAuth } from '../utils.js';
import AWS from 'aws-sdk';


const upload = multer()


const uploadRouter = express.Router();

uploadRouter.post('/', isAuth, upload.single('file'), async (req, res) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET
        })
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result)
                    }
                    else {
                        reject(error);
                    }
                })
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            })
        }
        const result = await streamUpload(req);
        res.send(result);
    } catch (err) {
        res.status(400).send(err)
    }
})

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET,
    region: "eu-central-1", 
});

const s3 = new AWS.S3();

const uploadToS3 = (req) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${req.file.originalname}`,
            Body: req.file.buffer,
        };

        s3.upload(params, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

uploadRouter.post('/pdf', isAuth, upload.single('file'), async (req, res) => {
    try {
        const result = await uploadToS3(req);

        res.setHeader('Content-Disposition', `inline; filename="${req.file.originalname}"`);
        res.setHeader('Content-Type', 'application/pdf');
        
        res.send(result);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


export default uploadRouter;

