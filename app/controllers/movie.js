var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// list page
exports.list = function(req , res){
	// Movie.fetch(function(err, movies){
	// 	if(err){
	// 		console.log(err)
	// 	}
	// 	res.render('list' , {
	// 		title: 'imooc 列表页',
	// 		movies: movies
	// 	})
	// })
	Movie
		.find({})
		.populate('category' , 'name')
		.exec(function(err , movies){
			res.render('list' , {
				title: 'imooc 列表页',
				movies: movies
			})
		})
}

// detail page
exports.detail = function(req , res){
	var id = req.params.id
	req.session.movieId = id

	Movie.findById(id , function(err , movie){
		Comment
			.find({movie: id})
			.populate('from' , 'name') // 从from的object字段中去关联user表，然后从user表中取回name值放入from字段中
			.populate('reply.from reply.to' , 'name')
			.exec(function(err , comments){
				res.render('detail' , {
					title: 'imooc ' + movie.title,
					movie: movie,
					comments: comments
				})				
			})
	})
}

// admin new page
exports.new = function(req , res){
	Category.find({} , function(err , categories){
		res.render('admin' , {
			title: 'imooc 后台录入页',
			categories: categories,
			movie: {}
		})		
	})
}

// admin update movie
exports.update = function(req , res){
	var id = req.params.id

	if(id){
//      Movie.findOne({_id: id} , function(err , movie){
		Movie.findById(id , function(err , movie){
			Category.find({} , function(err , categories){
				res.render('admin' , {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				})				
			})
		})
	}
}

// admin poster
exports.savePoster = function(req , res , next){
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename

	if(originalFilename){
		fs.readFile(filePath , function(err , data){
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname , '../../' , '/public/upload/' + poster)

			fs.writeFile(newPath , data , function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

// admin post movie
exports.save = function(req , res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(req.poster){
		movieObj.poster = req.poster
	}

	if(id){
		Movie.findById(id , function(err , movie){
			if(err){
				console.log(err)
			}

			var oldCategoryId = movie.category
			var newCategoryId = movieObj.category

			_movie = _.extend(movie , movieObj)
			_movie.save(function(err , movie){
				if(err){
					console.log(err)
				}
				Category.findById(newCategoryId , function(err , newCategory){
					if(err){
						console.log(err)
					}
					newCategory.movies.push(id)
					newCategory.save(function(err , result1){
						if(err){
							console.log(err)
						}
						Category.findById(oldCategoryId , function(err , oldCategory){
							if(err){
								console.log(err)
							}
							oldCategory.movies.forEach(function(item , idx , arr){
								if(item == id){
									oldCategory.movies.splice(idx , 1)
									oldCategory.save(function(err , result2){
										if(err){
											console.log(err)
										}
										res.redirect('/movie/' + movie._id)
									})
								}
							})	
						})
					})
				})
			})
		})
	}else{
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName

		_movie.save(function(err , movie){
			if(err){
				console.log(err)
			}

			if(categoryId){
				Category.findById(categoryId , function(err , category){
					category.movies.push(movie._id)

					category.save(function(err , category){
						if(err){
							console.log(err)
						}
						res.redirect('/movie/' + movie._id)
					})
				})				
			}else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err , category){
					movie.category = category._id
					movie.save(function(err , movie){
						if(err){
							console.log(err)
						}
						res.redirect('/movie/' + movie._id)
					})
					if(err){
						console.log(err)
					}
				})
			}
		})
	}
}

// list delete movie
exports.del = function(req , res){
	var id = req.query.id // ajax中url: '/admin/list?id' + id

	if(id){
		Movie.remove({_id: id} , function(err , movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
}