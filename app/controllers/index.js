var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req , res){
	Category
		.find({})
		.populate({path: 'movies' , options: {limit: 6}})
		.exec(function(err , categories){
			if(err){
				console.log(err)
			}
			res.render('index' , {
				title: 'imooc 首页',
				categories: categories
			})				
		})
}

// search
exports.search = function(req , res){
	var catId = req.query.cat
	var q = req.query.q
	var page = parseInt(req.query.p) || 0
	var count = 2
	var index = page * count

	if(catId){
		Category
			.find({_id: catId})
			.populate({
				path: 'movies' ,
				select: 'title poster'
			})
			.exec(function(err , categories){
				if(err){
					console.log(err)
				}
				
				var category = categories[0] || []
				var movies = category.movies || []
				var results = movies.slice(index , index + count)

				res.render('result' , {
					title: 'imooc 结果列表页面',
					keyword: category.name,
					currentPage: (parseInt(page) + 1),
					query: 'cat=' + catId,
					totalPage: Math.ceil(movies.length / 2),
					movies: results
				})				
			})	
	}else{
		Movie
			.find({title: new RegExp(q + '.*' , 'i')})
			.exec(function(err , movies){
				if(err){
					console.log(err)
				}
				
				var results = movies.slice(index , index + count)

				res.render('result' , {
					title: 'imooc 结果列表页面',
					keyword: q,
					currentPage: (parseInt(page) + 1),
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / 2),
					movies: results
				})
			})
	}
	
}