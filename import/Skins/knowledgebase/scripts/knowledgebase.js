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

		} catch (e) {
			console.log("ERROR");
		}

	}

	signalInit();

	// send messages to server with signalr 
	function sendMessage(text, id, action_type) {
		$.connection.hub.start().done(function () {
			con.server.send(id, text, action_type);
		});

	};

	// if sombody change or add comments then
	con.client.broadcastMessage = function (id, message, action_type) {
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
				var comments = _.template($('#comment_template').html());
				var creation_date = $("#" + id).find('.js-creation_date').last().data('time');
				$.ajax({
					url: "/OData.svc" + post_path + "/Comments?CreationDate gt datetime'" + creation_date + "'&$expand=CreatedBy,Actions",
					dataType: "json",
					type: 'GET',
					context: this,
					success: function (data) {
						$("#" + id).find('.post__comments').html(comments({ data: data.d.results }));

						//if (action_type == 'add') {
						//	$(comments({ data: data.d.results })).addClass("new_comment");
						//}
					},
					error: function (jqXHR, exception, error) {
						console.log(error);
					}
				});
			}
		}
		// change comments count
		if ($('.js-show_comments').length > 0) {
			$.ajax({
				url: "/OData.svc" + post_path + "/Comments?$select=__count",
				dataType: "json",
				type: 'GET',
				context: this,
				success: function (data) {
					var comment_obj = $("#" + id).find('.js-comments_count');
					var current_count = $("#" + id).find('.js-update_count');
					var post_ount = comment_obj.data('count');
					var diferrent = data.d.__count - post_ount;

					current_count.text(data.d.__count);
					comment_obj.attr('data-count', data.d.__count);
					if (diferrent > 0) {
						comment_obj.addClass('anim_cc');
					} else {
						comment_obj.removeClass('anim_cc');

					}
				},
				error: function (jqXHR, exception, error) {

				}
			});
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
				url: "/OData.svc" + post_path + "/Comments?$orderby=Id desc&$top=" + COMMENT_SHOW + "&$expand=CreatedBy,Actions,CreatedBy/Actions&metadata=no",
				dataType: "json",
				type: 'GET',
				context: this,
				success: function (data) {
					
					var resultObject = data.d.results;
					console.log(resultObject);
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
					url: "/OData.svc" + post_path + "/Comments?$expand=CreatedBy,Actions",
					dataType: "json",
					type: 'POST',
					async: false,
					data: JSON.stringify({
						"Description": comment_text,
						"__ContentType": "Comment",
					}),
					context: this,
					success: function (data) {

						comment_textarea.val('');
						comment_pos.append(comment({ data: data.d }));
						sendMessage(data.d.Description, post_id, "add");

						var count = parseInt($(this).closest('.js-post_id').find('.js-comments_count').attr('data-count')) + 1;
						$(this).closest('.js-post_id').find('.js-comments_count').attr('data-count', count).text("+");
						$(this).closest('.js-post_id').find('.js-update_count').text(count);

					},
					error: function (error) {
						// if no  comment folder then
						console.log("no  comments folder");
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
											sendMessage(data.d.Description, post_id, "add");

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

	// END COMMENTS ********************************************************************
});
