const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/avatars/', // Ensure this folder exists
  filename: function(req, file, cb){
    // Generate a unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb){
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!'); // Error message if not an image
  }
}

// Init upload variable
const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('avatar'); // 'avatar' is the field name in the form data

module.exports = { uploadAvatar }; 