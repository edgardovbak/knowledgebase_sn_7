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

	// Article Create/Edit *********************************************************************

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

	$(document).on("hover", '.dropdown', function () {
	}, function () {
		$(this).removeClass('open_dropdown');
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
});
