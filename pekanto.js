$(document).ready(function() {

    Parse.initialize("WT6BgncAF7wUJmHnyyhy324nrpi4XSjALf7PJAjO", "hG9xUxilm54Wqc4zZsl3vO5TrVRoGfIEDy9KgORq");

	var PostModel = Parse.Object.extend("PostModel"),
		query = new Parse.Query(PostModel);

	query.find({
		success: function (posts) {
			for (var i=0; i<posts.length; i++) {
				var post = posts[i],
					text = post.get("text"),
					name = post.get("name");
				$('<li>').addClass('post-item').
					text(name + ": " + text).
					prependTo('.posts').
					data("parseObject", post);
			}
		}
	})

	$('#navicon').click(function() {
	  $('.menu').toggle("slide");
	});

	var disablePost = function() {$('.button').addClass('disabled');},
		enablePost = function() {$('.button').removeClass('disabled');};

	$('.button').click(function() {
		var post = $('.chatbox').val(),
			poster = $('.name').val().toUpperCase(),
			date = new Date();

		if(post.length === 0 || poster.length === 0) {disablePost();}
		else {
			var $li = $('<li>').addClass('post-item').
					text(poster + ": " + post).
					prependTo('.posts'),
				postData = new PostModel();

			postData.set("text", post);
			postData.set("name", poster);
			postData.set("time", date);
			postData.save({
				success: function(postData) {
					$li.data("parseObject", postData);
				}
			});

	  		$('.chatbox').val('');
	  		disablePost();
	  	}
	});

	$('.posts').on("click", ".post-item", function() {
	  $(this).toggleClass('active-post');
	});

	$('.delete').click(function() {
		$('.active-post').each(function() {
			var postData = $(this).data("parseObject");
			postData.destroy();
			$(this).remove();
		});
	});

});