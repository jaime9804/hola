'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist.js');
var Album = require('../models/album.js');
var Song = require('../models/song.js');

function getSong(req, res){
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!song){
				res.status(404).send({message: 'La canción no existe !!'});
			}else{
				res.status(200).send({song});
			}
		}
	});
}

function getSongs(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec(function(err, songs){
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones !!'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}

function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name  = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'No se ha guardado la canción'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha actualizado la canción'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se ha borrado la canción'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'no suvido';
    
    if(req.file){
        // console.log(req.file);
        var file_path = req.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
     
        var ext_split = req.file.originalname.split('\.');
        var file_ext = ext_split[1];
     
        if(file_ext== 'mp3'){
          Song.findByIdAndUpdate(songId, {file:file_name}, (err, SongUpdated) => {
            if(!SongUpdated){
              res.status(404).send({message: 'No se ha podido actualizar la cancion'});
            }else{
              res.status(200).send({song: SongUpdated});
            }
          });
        }else{
          res.status(200).send({message: 'Extension del archivo no valida'});
     
        }
      }else{
        res.status(200).send({message: 'No has subido ninguna cancion..'});
      }
}


function getSongFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/songs/'+imageFile;
    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
           }else{
           res.status(200).send({message: 'No cancion.'});
           }
    });
}


module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
};