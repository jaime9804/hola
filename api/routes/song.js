'use strict'

var express = require('express');
var SongController = require('../controllers/song.js');
var api = express.Router();
var md_auth = require('../middlewares/authenticated.js');
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/songs');
  },
  filename(req, file = {}, cb)  {
    const { originalname } = file;
    
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    // cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + fileExtension);
    });
  },
});
var mul_upload = multer({dest: './uploads/songs',storage}); 

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);

api.post('/upload-file-song/:id', [md_auth.ensureAuth, mul_upload.single('image')],SongController.uploadFile);

api.get('/get-song-file/:imageFile', SongController.getSongFile);


module.exports = api;