const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({

  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    // if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    //   cb(new Error("Unsupported file type!"), false);
    //   return;
    // }
    cb(null, true);
  },
});


// const multer = require('multer');

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Create the multer instance
// const upload = multer({ storage: storage });

// module.exports = upload;