'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist.js');
var api = express.Router();
var md_auth = require('../middlewares/authenticated.js');
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/artists');
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

var mul_upload = multer({dest: './uploads/artists',storage}); 


api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

api.post('/upload-image-artist/:id', [md_auth.ensureAuth, mul_upload.single('image')], ArtistController.uploadImage);

api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;