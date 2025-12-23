const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "backend/uploads", // Cloudinary folder
      resource_type: "auto",
    });

    // remove file from local storage
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};
