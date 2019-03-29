const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
//set storage engine
const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req, file, cb){
     cb(null,file.fieldname + '-' + Date.now () + path.extname(file.originalname));
    
    }

});
//Init upload
const upload = multer({
storage: storage,
limits:{fileSize:1000000000}, 
fileFilter: function(req, file, cb){
 checkFileType(file,cb);
}

}).single('myImage');

//check File type
function checkFileType(file,cb){
    //Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test( path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error:Images only');
    }
}
const app = express();
//Set EJS
app.set('view engine','ejs');
//public folder
app.use(express.static('./public'));
app.get('/',(req , res) =>res.render('index'));
app.post('/upload',(req,res) =>{
upload(req, res, (err) =>{
    if(err){
        res.render('index',{
            msg:err
        });

    }else{
if(req.file == undefined){
    res.render('index',{
        msg:'error no Files are selected'
    });
}else{
    res.render('index', {
        msg: 'file Uploaded',
        file:'uploads/${req.file.filename}'
    });

}
    }
});
});
const port = 3000;
app.listen(port, ()=> console.log('The server is listening on the port $ {port}'));

