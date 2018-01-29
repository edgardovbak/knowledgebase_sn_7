<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.Portlets.ContentCollectionView" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="SenseNet.Portal.Portlets" %>
<%@ Import Namespace="SenseNet.Portal.Helpers" %>
<%@ Import Namespace="SenseNet.ContentRepository" %>

<sn:ContextInfo runat="server" Selector="CurrentContext" UsePortletContext="true" ID="myContext" />

<sn:ScriptRequest ID="underscore" runat="server" Path="$skin/scripts/underscore/underscore.js" />
<script type="text/javascript" src="/Root/Global/scripts/jqueryui/jquery.ui.autocomplete.js"></script>
<link rel="stylesheet" type="text/css" href="/Root/Global/styles/jqueryui/jquery.ui.autocomplete.css" />

<input type="hidden" class="sn-posts-workspace-path" value="<%=SenseNet.Portal.Virtualization.PortalContext.Current.ContextWorkspace.Path %>" />


<div class="js-send_message"></div>
<div id="target" data-pagecount="10">
    <div class="loader"></div>
</div>
<div id="paginationTarget"></div>



<script type="text/html" id="post_template">
    <! if (data.length == 0){ !>

    <div>
        No posts found for this search.
    </div>
    <!} else {
         _.each(data, function(item, key, list){
    !>

    <article class="post js-post_id" id="post_id_<!=item.Id !>" >
        <div class="post__general">
            <a href="#">

				<%--Avatar & name--%>
                <figure>
						<! if ( item.CreatedBy.Avatar._deferred == "" ) { !>
							<div class="post__general__avatar">
								<div class="post__general__avatar--placeholder"></div>
								<div class="post__general__avatar--letter"><!= item.CreatedBy.FullName[0] !></div>
							</div>
						<!} else { !>
							<div class="post__general__avatar" style="background: url('<!= item.CreatedBy.Avatar._deferred !>') no-repeat center center;background-size: cover;">
							</div>
						<!} !>
                    <figcaption><!= item.CreatedBy.FullName !></figcaption>
                </figure>
            </a>
            <div class="post__article">
				<%--Post Creation  date--%>
                <div class="post__info">
                    <span class="post__info_date">
						<!
							var dateP = new Date(item.CreationDate);
							var localDate = new Date(dateP.getTime() + dateP.getTimezoneOffset() * 60000);
							var options = {
							  year: 'numeric',
							  month: 'long',
							  day: 'numeric',
							  weekday: 'long',
							  timezone: 'UTC',
							  hour: 'numeric',
							  minute: 'numeric',
							  second: 'numeric'
							};
						!>
						<!= localDate.toLocaleString("hu", options) !>
                    </span>
					<div class="dropdown">
						<button class="btn btn--info js-manage_article">manage</button>
						<ul>
							<li>
								<a href="<!=item.BrowseUrl !>?action=Edit&back=<%= HttpUtility.UrlDecode( SenseNet.Portal.Virtualization.PortalContext.GetSiteRelativePath(SenseNet.Portal.Virtualization.PortalContext.Current.ContextNodePath) +"?"+ this.Request.QueryString) %>">Edit</a>
							</li>
							<li>
								<a href="<!=item.BrowseUrl !>" class="js-delete_post">Delete</a>
							</li>
						</ul>
					</div>

                </div>
				<%--Post title--%>
                <h2 class="post__title">
                    <a href="<!=item.BrowseUrl !>"><!=item.DisplayName !></a>
                </h2>
				<%--Post text--%>
                <div class="post__text"><!= item.Body !></div>
            </div>
        </div>
    </article>
    <! });
	} !>
</script>

<script type="text/html" id="paginationTemplate">
	<ul class="pagination">
		<!
			function getQueryVariable(variable) {
				   var query = window.location.search.substring(1);
				   var vars = query.split("&");
				   for (var i=0;i<vars.length;i++) {
						   var pair = vars[i].split("=");
						   if(pair[0] == variable){return pair[1];}
				   }
				   return(false);
			}

			function updateQueryStringParameter(uri, key, value) {
				var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
				var separator = uri.indexOf('?') !== -1 ? "&" : "?";
				if (uri.match(re)) {
					return uri.replace(re, '$1' + key + "=" + value + '$2');
				} else {
					return uri + separator + key + "=" + value;
				}
			}

			var pageCapacity = document.getElementById("target").getAttribute("data-pagecount");
			var pageCount = Math.ceil(pagination/pageCapacity);
			var activePage = parseInt(getQueryVariable("page"));
			activePage = (!activePage) ? 1 : activePage;
		!>
		<%--Previus controll button--%>
		<li class="pagination__buttons">
			<! if ( activePage == 1 ) { !>
				<span class="disabled">Prev</span>
			<! } else { !>
				<a href="<!= updateQueryStringParameter(window.location.href, "page", activePage-1) !>">Prev</a>
			<! } !>
		</li>
		<! if ( pageCount <= 5 ) { !>
			<%--PAgination numbers--%>
			<! for (var i=1; i <= pageCount; i++) { !>
				<li class="pagination__numbers">
					<! if ( activePage == i ) { !>
						<span class="disabled"><!= i !></span>
					<! } else { !>
						<a href="<!= updateQueryStringParameter(window.location.href, "page", i) !>"><!= i !></a>
					<! } !>
				</li>
			<! } !>
		<! } else { !>


			<! if ( activePage < 4 ) { !>
				<! for (var i=1; i <= activePage + 1; i++) { !>
					<li class="pagination__numbers">
						<! if ( activePage == i ) { !>
							<span class="disabled"><!= i !></span>
						<! } else { !>
							<a href="<!= i==1 ? "/" : updateQueryStringParameter(window.location.href, "page", i) !>"><!= i !></a>
						<! } !>
					</li>
				<! } !>
				<li class="pagination__numbers">
					<span class="disabled">...</span>
				</li>
				<li class="pagination__numbers">
					<a href="<!= updateQueryStringParameter(window.location.href, "page", pageCount) !>"><!= pageCount !></a>
				</li>
			<! } !>

			<! if ( activePage >= 4 & activePage <= pageCount-3 ) { !>
				<li class="pagination__numbers">
					<a href="/">1</a>
				</li>
				<li class="pagination__numbers">
					<span class="disabled">...</span>
				</li>
				<! for (var i=activePage-1; i <= activePage + 1; i++) { !>
					<li class="pagination__numbers">
						<! if ( activePage == i ) { !>
							<span class="disabled"><!= i !></span>
						<! } else { !>
							<a href="<!= updateQueryStringParameter(window.location.href, "page", i) !>"><!= i !></a>
						<! } !>
					</li>
				<! } !>
				<li class="pagination__numbers">
					<span class="disabled">...</span>
				</li>
				<li class="pagination__numbers">
					<a href="<!= updateQueryStringParameter(window.location.href, "page", pageCount) !>"><!= pageCount !></a>
				</li>
			<! } !>

			<! if ( activePage > pageCount-3 ) { !>
				<li class="pagination__numbers">
					<a href="/">1</a>
				</li>
				<li class="pagination__numbers">
					<span class="disabled">...</span>
				</li>
				<! for (var i=activePage-1; i <= pageCount; i++) { !>
					<li class="pagination__numbers">
						<! if ( activePage == i ) { !>
							<span class="disabled"><!= i !></span>
						<! } else { !>
							<a href="<!= updateQueryStringParameter(window.location.href, "page", i) !>"><!= i !></a>
						<! } !>
					</li>
				<! } !>
			<! } !>
		<! } !>

		<%--Next controll button--%>
		<li class="pagination__buttons">
			<! if ( activePage == pageCount ) { !>
				<span class="disabled">Next</span>
			<! } else { !>
				<a href="<!= updateQueryStringParameter(window.location.href, "page", activePage+1) !>">Next</a>
			<! } !>
		</li>
	</ul>
</script>

<%-- .js-modal is a global class for all modals --%>
<%-- .js-full_size is just for funtions that works with full screen img --%>
<div class="modal js-full_size js-modal" role="dialog" tabindex="0">
	<div class="table_cu">
		<div class="table_cu__cell">
			<img src="" alt="ful size picture" />
			<button class="btn btn--round close js-close_modal">
				<i class="fi flaticon-delete"></i>
			</button>
		</div>
	</div>
</div>


<div class="modal js-modal js-delete_post_modal" role="dialog" tabindex="0">
	<div class="table_cu">
		<div class="table_cu__cell">
			<button class="btn btn--round close js-close_modal">
				<i class="fi flaticon-delete"></i>
			</button>
			<div class="modal__body">
				<div class="modal__header">
					are sure about that?
				</div>
				<div class="modal__buttons">
					<button class="btn js-finish_delete_post btn--remove">yes</button>
					<button class="btn js-close_modal">no</button>
				</div>
			</div>
		</div>
	</div>
</div>
