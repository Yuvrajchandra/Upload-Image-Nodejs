//app.js
const express = require('express');
const multer = require("multer");


const app = express();

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
console.log(`App is listening on port ${port}`);
});


//Setting storage engine
const storageEngine = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  });

//initializing multer
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
      },
  });


app.use(express.static(__dirname + '/public'));
app.use('/images', express.static('images'));


const path = require("path");
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

app.post("/single", upload.single("image"), (req, res) => {
    // if (req.file) {
    //   res.send("Single file uploaded successfully");
    // } else {
    //   res.status(400).send("Please upload a valid image");
    // }
    console.log(JSON.stringify(req.file))
  var response = '<a href="/">Back</a><br>'
  response += "Image uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
  });

app.post("/multiple", upload.array("images", 5), (req, res) => {
    // if (req.files) {
    //   res.send("Muliple files uploaded successfully");
    // } else {
    //   res.status(400).send("Please upload a valid images");
    // }
    var response = '<a href="/">Back</a><br>'
    response += "Images uploaded successfully.<br>"
    for(var i=0;i<req.files.length;i++){
        response += `<img src="${req.files[i].path}" /><br>`
    }
    
    return res.send(response)
  });

