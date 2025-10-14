/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Configure storage for patient images
export const multerConfig = {
    storage: diskStorage({
        // Destination folder for uploaded files
        destination: './uploads/patient-images',
        // Filename generation
        filename: (req, file, callback) => {
            // Generate unique filename: timestamp-randomstring-originalname
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `patient-image-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    // File filter to only accept images
    fileFilter: (req, file, callback) => {
        // Allow only image files
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|bmp|webp|svg\+xml)$/)) {
            return callback(
                new BadRequestException(
                    'Only image files are allowed (jpg, jpeg, png, gif, bmp, webp, svg)',
                ),
                false,
            );
        }
        callback(null, true);
    },
    // Limit file size to 5MB
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};
