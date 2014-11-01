$(document).ready(function() {

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
					$('<li>').addClass('post-item').
						text(name + ": " + text).
						prependTo('.posts').
						data("parseObject", post);
				}
			}
		});
	} catch (e) {
		alert('This website is not usable in private browsing mode.');
	}

	$('#navicon').on("click", "a", function(e) {
			e.preventDefault();
	  	  	$('.menu').toggle("slide");
			$('.chatroom').slideToggle();
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
			postData.save();

			$li.data("parseObject", postData);
	  		$('.chatbox').val('');
	  		disablePost();
	  	}
	});

	$('.posts').on("click", ".post-item", function() {
	  $(this).toggleClass('active-post');
	});

	$('.delete button').click(function() {
		$('.active-post').each(function() {
			var postData = $(this).data("parseObject");
			postData.destroy();
			$(this).remove();
		});
	});

});