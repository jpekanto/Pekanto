$(document).ready(function() {

	var postMaker = function(poster, post) {
		var $liPost = $('<span>').text(post),
			$liPoster = $('<strong>').text(poster + ": "),
			$li = $('<li>').addClass('post-item').
				append($liPoster).
				append($liPost).
				prependTo('#posts');
		return $li;
	};

    Parse.initialize("WT6BgncAF7wUJmHnyyhy324nrpi4XSjALf7PJAjO", "hG9xUxilm54Wqc4zZsl3vO5TrVRoGfIEDy9KgORq");

	var PostModel = Parse.Object.extend("PostModel"),
		query = new Parse.Query(PostModel);

	query.descending("time");
	try {
		query.find({
			success: function (posts) {
				for (var i=posts.length-1; i>=0; i--) {
					var post = posts[i],
						text = post.get("text"),
						name = post.get("name");
					postMaker(name, text).
						data("parseObject", post);
				}
			}
		});
	} catch (e) {
		alert('This website is not usable in private browsing mode.');
	}

	
	var $chat = $('#chatroom');
	$('#navicon').on("click", "a", function(e) {
		e.preventDefault();
  	  	$('#menu').toggle("slide");
  	  	if ($chat.height() !== 0) {$('#chatroom').slideUp();}
	});

	var userId;
	$('.menu-sidebar').on("click", "li", function() {
		if ($chat.height() !== 0) {
			userId = $(this).text();
			$chat.slideUp(400, function() {
				$('textarea').attr("placeholder", "What do you want to say, " +
			userId + "?");
			});
		}
		$chat.slideDown();
	});

	$('#post-button').click(function() {
		var post = $('#chatbox').val(),
			poster = userId.toUpperCase(),
			date = new Date();

		if (post.length > 0) {
			var postData = new PostModel();
			postData.set("text", post);
			postData.set("name", poster);
			postData.set("time", date);
			postData.save();
			
			postMaker(poster, post).data("parseObject", postData);
	  		$('#chatbox').val('');
	  	}
	});

	$('#posts').on("click", ".post-item", function() {
	  $(this).toggleClass('active-post');
	});

	$('#delete-button').click(function() {
		$('.active-post').each(function() {
			var postData = $(this).data("parseObject");
			postData.destroy();
			$(this).remove();
		});
	});

});