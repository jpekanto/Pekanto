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
		query = new Parse.Query(PostModel),
		$chat = $('#chatroom'),
		$menu = $('#menu'),
		currentUser,
		resetForm = function () {
			$('#name-text').val("");
			$('#password-text').val("");
		},
		getHistory = function () {
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
		};

	$('#navicon').on("click", "a", function(e) {
		e.preventDefault();
		$menu.toggle("slide");
		if ($chat.css("display") !== "none") {
			var logOut = confirm("Are you sure you want to log out and exit chatroom?");
			if (logOut) {
				Parse.User.logOut();
				resetForm();
				$('#posts').empty();
				$chat.slideUp();
				alert("You have successfully logged out. Good bye!");
			}
		}
	});

	$('#sign-up').click(function() {
		var user = new Parse.User(),
			userName = $('#name-text').val(),
			userPass = $('#password-text').val();
		
		if (userName.length === 0 || userPass.length === 0) {
			$('#sign-up').addClass('disabled');
			alert("Both Username and Password are required.");
			resetForm();
			$('#sign-up').removeClass('disabled');
		} else {
			user.set("username", userName);
			user.set("password", userPass);
			user.signUp(null, {
				success: function(user) {
					currentUser = userName;
					$menu.toggle("slide");
					$chat.slideDown();
					$('textarea').attr("placeholder", "What's on your mind, " +
						currentUser + "?");
					getHistory();
				},
				error: function(user, error) {
					alert("There is something wrong.");
					resetForm();
				}
			});
		}
	})

	$('#sign-in').click(function() {
		var userName = $('#name-text').val(),
			userPass = $('#password-text').val();

		if (userName.length === 0 || userPass.length === 0) {
			$('#sign-in').addClass('disabled');
			alert("Both Username and Password are required.");
			resetForm();
			$('#sign-in').removeClass('disabled');
		} else {
			Parse.User.logIn(userName, userPass, {
				success: function (user) {
					currentUser = userName;
					$menu.toggle("slide");
					$chat.slideDown();
					$('textarea').attr("placeholder", "What's on your mind, " +
						currentUser + "?");
					getHistory();
				},
				error: function(user, error) {
					alert("There is something wrong.");
					resetForm();
				}
			});
		}
	});

	$('#post-button').click(function() {
		var post = $('#chatbox').val(),
			poster = currentUser.toUpperCase(),
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