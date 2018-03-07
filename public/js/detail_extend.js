(function($){
	$.fn.reply = function(){
		var parent = this.parent().parent()	
		var child = parent.find('.media-heading').find('.Name')
		var ToName = child.html()
		setTimeout(function(){
			$('textarea').val('回复' + ToName + ':').focus()
		})
	}
	$.fn.clearTxt = function(){
		this.val('')
	}
	$.fn.createDom = function(){
		var toId = this.data('tid')
		var commentId = this.data('cid')
		if($('#toId').length > 0){
			$('#toId').val(toId)
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm')
		}

		if($('#commentId').length > 0){
			$('#commentId').val(commentId)
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm')
		}
	}
	// $.fn.clickComment = function(options){
	// 	var settings = $.extend({
	// 		'fn_one': $(this).reply(),
	// 		'fn_two': $(this).createDom
	// 	},
	// 	options);
	// 	this.on('click' , function(options){
	// 		console.log(1)
	// 		return options
	// 	})
	// }
	$.fn.setContent = function(){
		var C_movie = $('#movie').val()
		var C_from = $('#from').val()
		var C_to = $('#toId').val() || ''
		var C_commentId = $('#commentId').val() || ''
		var C_content = $('textarea').val()

		var content = {'comment' : ''}
		var comment = {}

		// if(!comment['movie']){
		// 	comment['movie'] = []
		// 	comment['movie'].push(C_movie)
		// }
		comment['movie'] = (C_movie)
		comment['from'] = (C_from)
		comment['tid'] = (C_to)
		comment['cid'] = (C_commentId)
		comment['content'] = (C_content)

		content.comment = comment

		return content
	}
})(jQuery)