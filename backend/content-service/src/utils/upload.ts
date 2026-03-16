import multer from "multer";
import os from "os";

// We use the OS temporary directory to stream files there without eating memory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to OS temp directory
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB max limit
  },
});
