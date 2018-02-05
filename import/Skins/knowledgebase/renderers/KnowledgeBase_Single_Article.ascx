<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.Portlets.ContentCollectionView" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="SenseNet.Portal.Portlets" %>
<%@ Import Namespace="SenseNet.Portal.Helpers" %>
<%@ Import Namespace="SenseNet.ContentRepository" %>

<sn:ScriptRequest ID="underscore" runat="server" Path="$skin/scripts/underscore/underscore.js" />

<%
   String articlePath = this.Model.Content.Path;
   SenseNet.ContentRepository.Content tabContent = SenseNet.ContentRepository.Content.Load(articlePath);
	var tabNode = SenseNet.ContentRepository.Storage.Node.LoadNode(tabContent.Id);
%>

     <article class="post js-post_id js-post_page" id="post_id_<%=tabContent.Id %>" >
        <div class="post__general">
            <a href="#">

				<%--Avatar & name--%>
                <figure>
						<% if ( ((User)tabNode.CreatedBy).AvatarUrl == "") { %>
							<div class="post__general__avatar">
								<div class="post__general__avatar--placeholder"></div>
								<div class="post__general__avatar--letter">
									<%= ((User)tabNode.CreatedBy).FullName[0] %>
								</div>
							</div>
						<% } else { %>
							<div class="post__general__avatar" style="background: url(' <%= ((User)tabNode.CreatedBy).AvatarUrl %>') no-repeat center center;background-size: cover;">
							</div>
						<%} %>
                    <figcaption><%= ((User)tabNode.CreatedBy).FullName %></figcaption>
                </figure>
            </a>
            <div class="post__article">
				<%--Post Creation  date--%>
                <div class="post__info">
                    <span class="post__info_date js-post_date"></span>
					<div class="dropdown">
						<button class="btn btn--info js-manage_article">manage</button>
						<ul>
							<li>
								<a href="<%= tabNode.Path %>?action=Edit&back=<%= HttpUtility.UrlDecode( SenseNet.Portal.Virtualization.PortalContext.GetSiteRelativePath(SenseNet.Portal.Virtualization.PortalContext.Current.ContextNodePath) +"?"+ this.Request.QueryString) %>">Edit</a>
							</li>
							<li>
								<a href="<%= tabNode.Path %>" class="js-delete_post">Delete</a>
							</li>
						</ul>
					</div>
                </div>
				<%--Post title--%>
                <h2 class="post__title">
                    <a href="<%= tabContent.Path %>"><%=tabContent.DisplayName %></a>
                </h2>
				<%--Post text--%>
                <div class="post__text">
                    <%= tabContent["Body"] %>
                </div>
            </div>
        </div>

		 <%--Comments--%>
        <div class="post__comment_pannel js-comment_pannel" data-path="<%= tabNode.Path %>">
			<div>

				<div class="js-more post__comment_pannel__more" data-koef="10">more comments</div>

				<%--Comments List--%>
				<div class="post__comments js-post__comments"></div>

				<%--Add Commentts--%>
				<div class="table_cu add_comment">
					<div class="table_cu__cell add_comment__img">
						<label for="@@id">
							<span class="sr_only">Comment</span>
							<i class="fi flaticon-interface"></i>
						</label>
					</div>
					<div class="table_cu__cell">
						<textarea class="js-add_comment" data-path="<%= tabNode.Path %>" name="name" rows="2" cols="80"></textarea>
						<p>
							<small>press <strong>ctrl + Enter</strong> to send mesage</small>
						</p>
					</div>
				</div>
			</div>
        </div>
    </article>

<%--Edit coment template--%>
<script type="text/html" id="edit_comment">
	<textarea rows="2" class="js-active_editing"><!= data !></textarea>
	<div class="post__comments_controll">
		<button class="btn btn--save js-comment_save">
			Save
		</button>
		<button class="btn btn--remove js-comment_remove">
			Remove
		</button>
		<button class="btn btn--remove js-comment_back">
			Back
		</button>
	</div>
</script>

<%--Coment template--%>
<script type="text/html" id="comment_template">
    <!	var editable;
        _.each(data, function(item, key){
		editable = false;
		for (var i = 0; i < item.Actions.length - 1; i++) {
			if ( item.Actions[i].Name == 'Edit' ) {
				editable = true;
				break;
			}
		}
    !>

		<div	class="table_cu js-comment_block--remove js-creation_date"
				data-time="<!= item.CreationDate !>">
			<div class="table_cu__cell post__comments_avatar">

					<! if ( item.CreatedBy.Avatar._deferred == "" ) { !>
						<a href="#">
							<div class="post__comments_avatar--placeholder"></div>
							<div class="post__comments_avatar--letter"><!= item.CreatedBy.FullName[0] !></div>
						</a>
					<!} else { !>
						<a href="#"
							style="background: url('<!= item.CreatedBy.Avatar._deferred !>') no-repeat center center;background-size: cover;"
							aria-label="<!= item.CreatedBy.FullName !>">
						</a>
					<!} !>

			</div>
			<div class="table_cu__cell">
				<div class="post__comments_info">
					<a href="#" class="post__comments_name"><!= item.CreatedBy.FullName !></a>
					<!
						var dateC = new Date(item.CreationDate);
						var localDateC = new Date(dateC.getTime() + dateC.getTimezoneOffset() * 60000);
						var optionsC = {
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

					<time title="" class="post__comments_time"><!= localDateC.toLocaleString("hu", optionsC) !></time>
				</div>
				<div class="post__comments_text js-comments_text" data-id="<!= item.Id !>" id="commnet_id_<!= item.Id !>" data-path="<!= item.BrowseUrl !>">
					<div class="post__comments_text--edit js-edit_area">
						<!= item.Description !>
					</div>
					<!
						if ( editable ) {
					!>
						<button class="edit_comments js-edit_comments">
							<span class="fi flaticon-pencil"></span>
						</button>
					<! } !>
				</div>
			</div>
		</div>
	<! });  !>
</script>

<%--Coment add template--%>
<script type="text/html" id="comment_add_template">
		<!	var editable = false;
			for (var i = 0; i < data.Actions.length - 1; i++) {
				if ( data.Actions[i].Name == 'Edit' ) {
					editable = true;
					break;
				}
			}
		!>
		<div class="table_cu js-comment_block--remove anim--add_comment">

			<%-- Avatar --%>
			<div class="table_cu__cell post__comments_avatar">

					<! if ( data.CreatedBy.Avatar._deferred.length == 0 ) { !>
						<a href="#">
							<div class="post__comments_avatar--placeholder"></div>
							<div class="post__comments_avatar--letter"><!= data.CreatedBy.FullName[0] !></div>
						</a>
					<!} else { !>
						<a href="#"
							style="background: url('<!= data.CreatedBy.Avatar._deferred !>') no-repeat center center;background-size: cover;"
							aria-label="<!= data.CreatedBy.FullName !>">
						</a>
					<!} !>


			</div>

			<%-- Comment info --%>
			<div class="table_cu__cell">
				<div class="post__comments_info">
					<a href="#" class="post__comments_name"><!= data.CreatedBy.FullName !></a>
					<!
						var dateC = new Date(data.CreationDate);
						var localDateC = new Date(dateC.getTime() + dateC.getTimezoneOffset() * 60000);
						var optionsC = {
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
					<time title="" class="post__comments_time"><!= localDateC.toLocaleString("hu", optionsC) !></time>
				</div>
				<div class="post__comments_text js-comments_text" data-id="<!= data.Id !>" data-path="<!= data.BrowseUrl !>">
					<div class="post__comments_text--edit js-edit_area">
						<!= data.Description !>
					</div>
					<!
						if ( editable ) {
					!>
						<button class="edit_comments js-edit_comments">
							<span class="fi flaticon-pencil"></span>
						</button>
					<! } !>
				</div>
			</div>
		</div>
</script>

<script>
	$(document).ready(function () {
		var dateP = new Date('<%=tabContent.CreationDate%>');
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
		localDate.toLocaleString("hu", options);

		$('.js-post_date').text(localDate.toLocaleString("hu", options));
	});
</script>
