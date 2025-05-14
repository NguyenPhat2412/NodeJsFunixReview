const fs = require("fs");

// Function xóa file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
      console.log("file đã được xóa");
    });
  } else {
    console.log("file không tồn tại");
  }
};

exports.deleteFile = deleteFile;
