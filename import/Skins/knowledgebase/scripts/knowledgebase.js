// must bz the same as in template (data-koef)
var COMMENT_SHOW = 10;
var MORE_COMMENTS = 50;

//read query parameters from url
var getUrlParam = function (name, url, ret) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? ret : results[1];
}

//load data into js templates
var loadData = function (data) {
	if ($("#post_template").length > 0) {
		var template = _.template($("#post_template").html());
		$("#target").html(template({ data: data.results }));
	}
}

//load pagination
var pagination = function (data) {
	if ($("#paginationTarget").length > 0) {
		var paginationTemplate = _.template($("#paginationTemplate").html());
		$("#paginationTarget").html(paginationTemplate({ pagination: data.results.length }));
	}
}

// get parameter in url
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) { return pair[1]; }
	}
	return (false);
}

//get data from server
var getData = function () {
	var activePage = parseInt(getQueryVariable("page"));
	activePage = (!activePage) ? 1 : activePage;
	var PAGE_COUNT = $("#target").attr("data-pagecount");
	var skip = (activePage - 1) * PAGE_COUNT;
	odata.fetchContent({
		path: "/Root/Sites/KnowledgeBaseSn7/Posts",
		query: 'InTree:"/Root/Sites/KnowledgeBaseSn7/Posts" +Type:KnowledgeBaseArticle_v_2 .REVERSESORT:Id .SKIP:' + skip + ' .TOP:' + PAGE_COUNT,
		$expand: ["CreatedBy"],
		$select: ["Id", "CreatedBy/Avatar", "CreatedBy/FullName", "BrowseUrl", "DisplayName", "Body", "CreationDate"],
		metadata: "no"
	}).done(function (data) {
		console.log(data);
		if (!data || !data.d)
			$.error('OData reply is incorrect for shapes request.');
		loadData(data.d);
	});
}

var getDataCount = function () {
	odata.fetchContent({
		path: "/Root/Sites/KnowledgeBaseSn7/Posts",
		query: 'InTree:"/Root/Sites/KnowledgeBaseSn7/Posts" +Type:KnowledgeBaseArticle_v_2',
		$select: ["Id"],
		metadata: "no"
	}).done(function (data) {
		if (!data || !data.d)
			$.error('OData reply is incorrect for shapes request.');
		pagination(data.d);
	});
}


// loader template
var loader = '<div class="loader js-loader">' +
	'<div class="loader__circ">' +
	'<div class="loader__load">Loading...</div>' +
	'<div class="loader__hands"></div>' +
	'<div class="loader__body"></div>' +
	'<div class="loader__head">' +
	'<div class="loader__eye"></div>' +
	'</div>' +
	'</div>' +
	'</div>';

$(document).ready(function () {

	// if wee ar on index page then get all posts
	if ($('#target').length > 0) {
		getData();
		getDataCount();
	}


	// controll  search with keyboard
	$(".js-search_input").on('keydown', function (e) {
		//if enter was pressed, do search
		if (event.keyCode == 13) {
			e.preventDefault();
			doSearch();
		}
	});

	//search start
	$('.js-do_search').on('click', function () {

	});

	//show/hide sidebar on mobile devicese
	$('.js-toggle_mobile_menu').on('click', function (e) {
		e.preventDefault();
		$('body').toggleClass('open_menu');
		if ($(this).attr("aria-expanded") == "true") {
			$(this).attr("aria-expanded", "false");
		} else {
			$(this).attr("aria-expanded", "true");
		}
	});

	// hide sidebar when click on overlay background
	$('.js-overlay').on('click', function () {
		$('body').removeClass('open_menu');
	});

	// fullscreen
	$(document).on('click', '.post__text a', function (e) {
		if ($(this).find('img').length > 0) {
			e.preventDefault();
			var fullsize_url = $(this).attr('href');
			$('.js-full_size').addClass('open_modal').find('img').attr("src", fullsize_url);
			$('body, html').addClass('no_scroll');
		}
	});

	// show real size from image in modal
	$(document).on('click', '.post__text img', function () {
		// get the image url with original size
		var fullsize_url = $(this).attr('src');
		// open modal
		$('.js-full_size').addClass('open_modal').find('img').attr("src", fullsize_url);
		// remove scroll from body
		$('body, html').addClass('no_scroll').attr("tabindex", -1);
	});

	// close modal window
	$('.js-close_modal, .js-full_size').on('click', function (e) {
		e.preventDefault();
		// close modal window
		$(this).closest('.js-modal').removeClass('open_modal');
		// add scroll to the body
		$('body, html').removeClass('no_scroll').attr("tabindex", 0);
	});

	// modal window accesibility
	$(document).keydown(function (e) {
		if ($('.js-modal.open_modal').length > 0) {
			if (e.keyCode == 27) {
				$('.js-modal.open_modal').find('.js-close_modal').click();
			}

			if (e.keyCode == 9) {
				var focus = $(":focus");
				if (focus.closest('.js-modal').length == 0) {
					$('.js-modal.open_modal').focus();
				}

			}
		}
	});

	// image size and position modal window
	$('.js-range_img_size').on('input', function () {
		$(this).next().text($(this).val() + " %");
	});

	// END modal window ******************************************************************

	if ($('.js-tagcloud').length > 0) {
		var tag_list = $('.js-tagcloud').attr('data-list').split(",");

		// if post have some labels then
		var Used_tags_list;
		if ($('.js-tagsfield').length > 0) {
			// get list of used tags and convert to array
			Used_tags_list = $('.js-tagsfield').val().split(";");
		} else {
			Used_tags_list = $('.js-tagsfield_block').text().split(";");
		}

		$('.js-tagcloud').tagcloud({
			data: tag_list,
			data_used: Used_tags_list
		});
	}

	// add tags to  the default sn tags control from customiyed tag cloud
	$(document).on('click', '.footer_button .sn-submit:not(.sn-button-cancel)', function (e) {
		var tags_list = "";

		// array with all choisen tags
		var tags = $('.js-used .tagcloud__choisen');
		for (var i = 0; i < tags.length; i++) {
			tags_list += $(tags[i]).attr('data-value') + ";";
		}

		// remove the last symbol from string with tags list.
		tags_list = tags_list.substring(0, tags_list.length - 1)

		$('.js-tagsfield').val(tags_list);
		if ($('.js-tagsfield').val().length == 0) {
			e.preventDefault();
		}
	});


	// Article Create/Edit *********************************************************************

	$(document).on('click', '.js-manage_article', function (e) {
		e.preventDefault();
		$(this).closest('.dropdown').toggleClass('open_dropdown');
	});

	$(document).on('click', '.dropdown li a', function (e) {
		$(this).closest('.dropdown').toggleClass('open_dropdown');
	});

	var hideInterval;
	$(document).on({
		mouseenter: function () {
			clearInterval(hideInterval);
		},
		mouseleave: function () {
			var dd = $(this);
			hideInterval = setTimeout(function () {
				dd.removeClass('open_dropdown');
			}, 5000);
		}
	}, '.dropdown');

	$(document).on("click", function (e) {
		var target = $(e.target);
		if (target.closest('.dropdown').length == 0) {
			$('.dropdown').removeClass('open_dropdown');
		}
	});

	// manage posts actions
	var post_for_delete;

	// delete post action
	$(document).on('click', '.js-delete_post', function (e) {
		e.preventDefault();
		// show modal
		$('.js-delete_post_modal').addClass('open_modal');
		// post id that is deleted
		post_for_delete = $(this).closest('.js-post_id');
	});

	// delete post modal
	$('.js-finish_delete_post').on('click', function (e) {
		e.preventDefault();
		$.ajax({ // request to delete the post
			url: "/OData.svc" + post_for_delete.find('.js-delete_post').attr('href'),
			dataType: "json",
			contentType: 'application/json',
			type: 'DELETE',
			context: this,
			async: false,
			success: function (data) {
				post_for_delete.remove();
			},
			error: function () {
				console.log('Problem with connection'); // error message
			}
		});
		post_path_for_remove = "";

		$(this).closest('.js-modal').removeClass('open_modal');
		$('body, html').removeClass('no_scroll');
	});

	//COMMENTS ********************************************************************

	function signalInit() {
		// init signalr and catch error
		try {
			console.log("SignalR start working ....");
			con = $.connection.chatHub;
			$.connection.hub.start().done(function () {
				con.server.send("init", "hi");
			});
		} catch (e) {
			console.log("ERROR");
		}

	}

	signalInit();

	// send messages to server with signalr
	function sendMessage(text, id, action_type, comment_id) {
		$.connection.hub.start().done(function () {
			con.server.send(id, text, action_type, comment_id);
		});

	};

	// if sombody change or add comments then
	con.client.broadcastMessage = function (id, message, action_type, comment_id) {
		console.log("asds");
		console.log(message);
		var post_path;
		if (action_type != 'edit') {
			post_path = $("#" + id).find('.js-add_comment').data('path');
			post_block = $("#" + id).find('.post__comments');
		} else {
			post_path = $("#" + id).closest('.js-comment_pannel').find('.js-add_comment').data('path');
			post_block = $("#" + id).closest('.js-comment_pannel').find('.post__comments');
		}
		// if comments block is open then
		if ($.trim(post_block.html()).length) {
			// detect action type (edit, add, init)
			if (action_type == 'edit') {
				$("#" + id).find('.js-edit_area').text(message);
			} else {
				// get new added comment
				var comments = _.template($('#comment_template').html());
				var creation_date = $("#" + id).find('.js-creation_date').last().data('time');
				$.ajax({
					url: "/OData.svc" + post_path + "/Comments?$orderby=Id desc&$top=" + COMMENT_SHOW + "&$expand=CreatedBy,Actions",
					dataType: "json",
					type: 'GET',
					context: this,
					success: function (data) {
						var resultObject = data.d.results;
						if (resultObject !== undefined) {
							resultObject.reverse();
						}
						$("#" + id).find('.post__comments').html(comments({ data: resultObject }));
					},
					error: function (jqXHR, exception, error) {
						console.log(error);
					}
				});
			}
		}
	}

	//show hide comments
	$(document).on('click', '.js-show_comments', function (e) {
		e.preventDefault();
		var comments_block = $(this).closest('.js-post_id').find('.js-comment_pannel');

		comments_block.slideToggle(); // slide down/up comments

		// if comments block is not empty then
		if (!$.trim(comments_block.find('.post__comments').html()).length) {

			if (comments_block.find('.js-loader').length == 0) {
				comments_block.append(loader);
			}

			var comments = _.template($('#comment_template').html());
			var post_path = $(this).data('path'); // save path to the post

			$.ajax({
				url: "/OData.svc" + post_path + "/Comments?$orderby=Id desc&$top=" + COMMENT_SHOW + "&$expand=__count/CreatedBy,Actions,CreatedBy/Actions&metadata=no",
				dataType: "json",
				type: 'GET',
				context: this,
				success: function (data) {
					var resultObject = data.d.results;
					if (resultObject !== undefined) {
						resultObject.reverse();
					}
					$(this).closest('.js-post_id').find('.js-comment_pannel').removeClass('elem--hidden');
					$(this).closest('.js-post_id').find('.js-loader').remove();
					$(this).closest('.js-post_id').find('.post__comments').html(comments({ data: resultObject }));
				},
				error: function (jqXHR, exception, error) {
					$(this).closest('.js-post_id').find('.js-comment_pannel').removeClass('elem--hidden');
					$(this).closest('.js-post_id').find('.js-loader').remove();
				}
			});
		}
	});

	if ($('.js-post_page').length > 0) {
		var comments_block = $('.js-comment_pannel');
		if (comments_block.find('.js-loader').length == 0) {
			comments_block.find('.js-post__comments').append(loader);
		}
		var comments = _.template($('#comment_template').html());
		var post_path = comments_block.data('path'); // save path to the post
		$.ajax({
			url: "/OData.svc" + post_path + "/Comments?$orderby=Id desc&$top=" + COMMENT_SHOW + "&$expand=CreatedBy,Actions,CreatedBy/Actions",
			dataType: "json",
			type: 'GET',
			async: false,
			success: function (data) {
				var resultObject = data.d.results;
				resultObject.reverse();
				comments_block.find('.js-loader').remove();
				comments_block.find('.js-post__comments').html(comments({ data: resultObject }));
			},
			error: function (jqXHR, exception, error) {
				comments_block.find('.js-loader').remove();
			}
		});
	}

	// add new comment
	$(document).on('keydown', '.js-add_comment', function (e) {
		if (e.ctrlKey && e.keyCode == 13) {
			// if pressed Ctrl + enter button combination then

			var comment_textarea = $(this);
			var post_path = comment_textarea.data('path');
			var comment_text = comment_textarea.val();
			var comment_pos = comment_textarea.closest('.js-comment_pannel').find('.js-post__comments');
			var comment = _.template($('#comment_add_template').html());
			var comments_count = comment_textarea.closest('.js-post_id').find('js-comments_count');
			var post_id = comment_textarea.closest('.js-post_id').attr('id');

			// request to create comment
			if (comment_text.length != 0) {

				$.ajax({
					url: "/OData.svc" + post_path + "/Comments?$expand=CreatedBy,Actions&$select=CreationDate,CreatedBy/Avatar,Actions,CreatedBy/FullName,Id,BrowseUrl,Description",
					dataType: "json",
					type: 'POST',
					async: false,
					data: JSON.stringify({
						"Description": comment_text,
						"__ContentType": "Comment",
					}),
					context: this,
					success: function (data) {
						console.log(data);
						comment_textarea.val('');
						comment_pos.append(comment({ data: data.d }));
						sendMessage(data.d.Description, post_id, "add", data.d.Id);

						var count = parseInt($(this).closest('.js-post_id').find('.js-comments_count').attr('data-count')) + 1;
						$(this).closest('.js-post_id').find('.js-comments_count').attr('data-count', count).text("+");
						$(this).closest('.js-post_id').find('.js-update_count').text(count);

					},
					error: function (error) {
						// if no  comment folder then
						if (error.status == 404) {
							// request to create comments folder
							$.ajax({
								url: "/OData.svc" + post_path,
								dataType: "json",
								type: 'POST',
								data: JSON.stringify({
									"Name": "Comments",
									"__ContentType": "SystemFolder",
								}),
								success: function (data) {
									// after folder is created add comment
									console.log("add comments folder");
									$.ajax({
										url: "/OData.svc" + post_path + "/Comments?$expand=CreatedBy,Actions",
										dataType: "json",
										type: 'POST',
										data: JSON.stringify({
											"Description": comment_text,
											"__ContentType": "Comment",
										}),
										context: this,
										success: function (data) {
											comment_textarea.val('');
											comment_pos.append(comment({ data: data.d }));
											sendMessage(data.d.Description, post_id, "add", data.d.Id);

											var count = parseInt($(this).closest('.js-post_id').find('.js-comments_count').attr('data-count')) + 1;
											$(this).closest('.js-post_id').find('.js-comments_count').attr('data-count', count).text("+");
											$(this).closest('.js-post_id').find('.js-update_count').text(count);

										},
										error: function (error) {
										}
									});
								},
								error: function (error) {
									console.log(error);
								}
							});
						}
					}
				});
			}
		}
	});

	//edit comment
	var comment_text_old;
	$(document).on('click', '.js-edit_comments', function (e) {
		e.preventDefault();
		var comment_text = $(this).closest('.js-comments_text').find('.js-edit_area');
		comment_text_old = comment_text.text();
		// for animation add width property tot the block
		comment_text.css('width', comment_text.width());
		// save template
		var edit_comment = _.template($('#edit_comment').html());
		// add editing template
		comment_text.html(edit_comment({ data: $.trim(comment_text.text()) }));
		$(this).closest('.js-comments_text').addClass('start_edit');
		comment_text.animate({
			width: '100%',
		}, 200, function () {
			// Animation complete.
			comment_text.find('textarea').focus();
		});
	});

	$(document).on('keydown', '.js-active_editing', function (e) {
		if (e.keyCode == 27) {
			$(this).closest('.js-edit_area').css('width', 'auto');
			$(this).closest('.js-comments_text').removeClass('start_edit');
			$(this).closest('.js-edit_area').text(comment_text_old); // remove textarea and show new text
		}
	});

	// save edited comment
	$(document).on('click', '.js-comment_save', function (e) {
		e.preventDefault();
		var post_path = $(this).closest('.js-comments_text').data('path'); // save path to the comment
		var comment_block = $(this); // current block
		var new_comment_text = $(this).closest('.js-edit_area').find('.js-active_editing').val(); // text that is in textarea
		var comment_id = $(this).closest('.js-comments_text').attr('id');

		$.ajax({ // request to change description field in comment
			url: "/OData.svc" + post_path,
			dataType: "json",
			contentType: 'application/json',
			type: 'PATCH',
			context: this,
			data: JSON.stringify({
				"Description": new_comment_text
			}),
			success: function (data) {
				comment_block.closest('.js-edit_area').css('width', 'auto');
				$(this).closest('.js-comments_text').removeClass('start_edit');
				comment_block.closest('.js-edit_area').text(new_comment_text); // remove textarea and show new text
				sendMessage(new_comment_text, comment_id, "edit")
			},
			error: function () {
				console.log('Problem with connection'); // error message
			}
		});
	});

	//remove comment
	$(document).on('click', '.js-comment_remove', function (e) {
		e.preventDefault();
		var post_path = $(this).closest('.js-comments_text').data('path'); // save path to the comment
		var comment_block = $(this); // current block
		var post_id = $(this).closest('.js-post_id').attr('id');
		$.ajax({ // request to change description field in comment
			url: "/OData.svc" + post_path,
			dataType: "json",
			contentType: 'application/json',
			type: 'DELETE',
			context: this,
			success: function (data) {
				comment_block
					.closest('.js-comment_block--remove')
					.addClass('anim--remove');
				setTimeout(function () {
					comment_block
						.closest('.js-comment_block--remove')
						.remove();
				}, 300
				);
				sendMessage("remove", post_id, "remove");

				var count = parseInt($(this).closest('.js-post_id').find('.js-comments_count').attr('data-count')) - 1;
				$(this).closest('.js-post_id').find('.js-comments_count').attr('data-count', count).text(count);
				$(this).closest('.js-post_id').find('.js-update_count').text(count);
			},
			error: function () {
				console.log('Problem with connection'); // error message
			}
		});
	});

	$(document).on('click', '.js-comment_pannel', function () {
		$(this).closest('.js-post_id').find('.js-comments_count').removeClass('anim_cc');
	});

	$(document).on('click', '.js-comment_back', function (e) {
		e.preventDefault();
		$(this).closest('.js-edit_area').css('width', 'auto');
		$(this).closest('.js-comments_text').removeClass('start_edit');
		$(this).closest('.js-edit_area').text(comment_text_old); // remove textarea and show new text
	});

	$(document).on('click', '.js-more', function () {
		var post = $(this).closest('.js-post_id');
		var comments_block = post.find('.js-comment_pannel');
		var skip_com = $(this).data("koef");
		$(this).data("koef", skip_com + MORE_COMMENTS);
		var first_elem = post.find('.js-post__comments > div').first();
		var comments = _.template($('#comment_template').html());
		var post_path = post.find('.js-add_comment').data('path'); // save path to the post
		$.ajax({
			url: "/OData.svc" + post_path + "/Comments?$orderby=Id desc&$skip=" + skip_com + "&$top=" + MORE_COMMENTS + "&$expand=CreatedBy,Actions,CreatedBy/Actions",
			dataType: "json",
			type: 'GET',
			context: this,
			async: false,
			success: function (data) {
				var resultObject = data.d.results;
				resultObject.reverse();
				var comm = comments({ data: resultObject });
				post.find('.js-post__comments').prepend(comm);
				$(this).attr("data-koef", skip_com++);
				$('html, body').animate({
					scrollTop: first_elem.offset().top - 200
				}, 400);
			},
			error: function (jqXHR, exception, error) {
				console.log("Error");
			}
		});
	});

	// END COMMENTS ********************************************************************
});
