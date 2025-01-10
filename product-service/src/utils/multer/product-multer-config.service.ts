import * as fs from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { v1 as uuid } from 'uuid';

@Injectable()
export class ProductMulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const path = './uploads/products';
          if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
          return cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}.png`);
        },
      }),

      fileFilter: (req, file, cb) => {
        const mimetypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        if (mimetypes.includes(file.mimetype)) return cb(null, true);
        return cb(
          new BadRequestException(
            'Only .png, .jpg .gif and .jpeg format allowed.',
          ),
          false,
        );
      },
    };
  }
}
