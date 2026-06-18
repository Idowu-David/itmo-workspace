import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split(".").slice(0, -1).join(".");
    return {
      folder: "ITMOProofOfWork",
      resource_type: "auto", // lets Cloudinary detect image, video, or raw automatically
      public_id: `${Date.now()}-${originalName}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
