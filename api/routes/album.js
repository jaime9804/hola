'use strict'

var express = require('express');
var AlbumController = require('../controllers/album.js');
var api = express.Router();
var md_auth = require('../middlewares/authenticated.js');

var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/albums');
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
var mul_upload = multer({dest: './uploads/albums',storage}); 

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post('/upload-image-album/:id', [md_auth.ensureAuth, mul_upload.single('image')], AlbumController.uploadImage);

api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;