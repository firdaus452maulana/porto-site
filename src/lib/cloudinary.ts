import { Cloudinary } from '@cloudinary/url-gen';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

const generateSignature = (publicId: string, timestamp: number) => {
  const params = {
    public_id: publicId,
    timestamp
  };

  // Sort parameters alphabetically and join with &
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key as keyof typeof params]}`)
    .join('&');

  // Generate SHA-1 HMAC signature
  const signature = CryptoJS.HmacSHA1(
    paramString,
    import.meta.env.VITE_CLOUDINARY_API_SECRET
  ).toString(CryptoJS.enc.Hex);
  
  return signature;
};

export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    const timestamp = Date.now();
    // const signature = cloudinary.utils.api_sign_request(
    //   {
    //     public_id: publicId,
    //     timestamp: timestamp
    //   },
    //   import.meta.env.VITE_CLOUDINARY_API_SECRET
    // );
    const signature = generateSignature(publicId, timestamp)

    await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
        api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
        timestamp: timestamp,
        signature: signature
      }
    );
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete Cloudinary image');
  }
};

export default cld;

