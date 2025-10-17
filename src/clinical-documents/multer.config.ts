/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Configure storage for clinical documents
export const multerConfigClinicalDocuments = {
  storage: diskStorage({
    // Destination folder for uploaded files
    destination: './uploads/clinical_documents',
    // Filename generation
    filename: (req, file, callback) => {
      // Generate unique filename: timestamp-randomstring-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `clinical-doc-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  // File filter to accept documents and images
  fileFilter: (req, file, callback) => {
    // Allow document files and images
    const allowedMimeTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          'Only document files (PDF, DOC, DOCX, XLS, XLSX, TXT) and images are allowed',
        ),
        false,
      );
    }
    callback(null, true);
  },
  // Limit file size to 10MB
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};
