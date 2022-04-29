import sharp from 'sharp';

export const compressFile = async (file: Express.Multer.File) => {
  const imgBuffer = await sharp(file.buffer).rotate().png({ quality: 20 }).toBuffer();
  return imgBuffer;
};
