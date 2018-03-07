$(function(){
	// $('.comment').clickComment({
	// 	'fn_one': $(this).reply(),
	// 	'fn_two': $(this).createDom()
	// })
	$('.comment').click(function(e){
		$(this).reply()

		$(this).createDom()

	})

	$('.submit').on('click' , function(){
		var content = $(this).setContent()
		$('textarea').val('')

		$.ajax({
			type: 'POST',
			url: '/user/comment/update',
			dataType: 'json',
			data: content,
			success: function(results){
				var comments = results.comments
				$('.media-list').html('')
				var MHTML = []
				var RHTML = []
				var DOM
				$(comments).each(function(index , ele){
					var Mcontent = $('<li>').attr('class' , 'media').append(
						'<div class="pull-left">'
							+ '<a class="comment" href="#comments" data-cid="' + $(this)[0]._id + '"' + 'data-tid="' + $(this)[0].from._id + '"' + '>'
								+ '<img src style="width: 60px; height: 64px" class="media-object">' 
							+ '</a>' + 
						'</div>' + 
						'<div class="media-body content-' + index + '">'
							+ '<h4 class="media-heading">' 
								+ '<span class="Name">' + $(this)[0].from.name + '</span>'
								+ '<span class="time" style="font-size: 14px; float: right">' + $(this)[0].meta.createAt + '</span>'
							+ '</h4>'
							+ '<p>' + $(this)[0].content + '</p>' +
						'</div>' +
						'<hr>')
					$('.media-list').append(Mcontent)
					if($(this)[0].reply.length == 0){
					}else{
						$($(this)[0].reply).each(function(){
							var Rcontent = $('<div>').attr('class' , 'media').append(
								'<div class="pull-left">'
									+ '<a class="comment" href="#comments" data-cid="' + $(this)[0]._id + '"' + 'data-tid="' + $(this)[0].from._id + '"' + '>'
										+ '<img src style="width: 60px; height: 64px" class="media-object">' 
									+ '</a>' + 
								'</div>' + 
								'<div class="media-body">'
									+ '<h4 class="media-heading">' 
										+ '<span class="Name">' + $(this)[0].from.name + '</span>'
										+ '<span class="text-info">&nbsp;回复&nbsp;</span>'
										+ '<span class="ToName">' + $(this)[0].to.name + '</span>'
										+ '<span class="time" style="font-size: 14px; float: right">' + $(this)[0].meta.createAt + '</span>'
									+ '</h4>'
									+ '<p>' + $(this)[0].content + '</p>' +
								'</div>')
							$('.content-' + index).append(Rcontent)
						})
					}
				})
				$('.comment').click(function(e){
					$(this).reply()

					$(this).createDom()

				})
			}
		})
	})

	$('.time').each(function(){
		var timeHTML = $(this).html()
		var d = new Date(timeHTML)
		curTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
		$(this).html(curTime)
	})
})