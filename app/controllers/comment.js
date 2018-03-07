var Comment = require('../models/comment')
var Movie = require('../models/movie')

// comment save
exports.save = function(req , res , next){
	console.log(req.body)
	var _comment = req.body.comment
	var movieId = _comment.movie

	if(_comment.cid){
		Comment.findById(_comment.cid , function(err , comment){
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}

			comment.reply.push(reply)

			comment.save(function(err , comment){
				if(err){
					console.log(err)
				}
				next()
				// res.redirect('/movie/' + movieId)
			})
		})
	}else{
		var comment = new Comment(_comment)

		comment.save(function(err , comment){
			if(err){
				console.log(err)
			}
			next()
			// res.redirect('/movie/' + movieId)
		})
	}
}

// comment update
exports.update = function(req , res){
	var id = req.session.movieId

	Movie.findById(id , function(err , movie){
		Comment
			.find({movie: id})
			.populate('from' , 'name') // 从from的object字段中去关联user表，然后从user表中取回name值放入from字段中
			.populate('reply.from reply.to' , 'name')
			.exec(function(err , comments){
				console.log(comments)
				res.json({comments : comments})				
			})
	})
}