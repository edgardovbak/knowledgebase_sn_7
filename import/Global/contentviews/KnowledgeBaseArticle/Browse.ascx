<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.UI.SingleContentView" %>
<%@ Import Namespace="SenseNet.ContentRepository" %>

<sn:ScriptRequest ID="underscore" runat="server" Path="$skin/scripts/underscore/underscore.js" />

<sn:ErrorView ID="ErrorView1" runat="server" />
<%	var createdby = this.Content.ContentHandler.CreatedBy as SenseNet.ContentRepository.User;
	var postId =  this.Content.ContentHandler.Id;
	var path = this.Content.ContentHandler.Path;
%>

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
		<div class="table_cu js-comment_block--remove js-creation_date" data-time="<!= item.CreationDate !>">
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
					<time title="" class="post__comments_time"><!= item.CreationDate.toString() !></time>
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
</script> <%--End Coment template--%>

<%--Coment template--%>
<script type="text/html" id="comment_template_new">
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
		<div class="table_cu js-comment_block--remove js-creation_date" data-time="<!= item.CreationDate !>">
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
					<time title="" class="post__comments_time"><!= item.CreationDate.toString() !></time>
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
</script> <%--End Coment template--%>

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
		<div class="table_cu js-comment_block--remove anim--add_comment new_comment">
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
			<div class="table_cu__cell">
				<div class="post__comments_info">
					<a href="#" class="post__comments_name"><!= data.CreatedBy.FullName !></a>
					<time title="" class="post__comments_time"><!= data.CreationDate.toString() !></time>
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

<aricle class="post js-post_id js-post_page" id="post_id_<%= postId %>">
	
    <div class="post__general">
		<%-- Avatar --%>
		<a href="<%=SenseNet.Portal.Helpers.Actions.ActionUrl(SenseNet.ContentRepository.Content.Create(createdby), "Profile") %>">
			<figure>
				<% if (Content["OriginalAuthor"] != null) { %>
					<div class="post__general__avatar">
						<div class="post__general__avatar--placeholder"></div>
						<div class="post__general__avatar--letter"><!= item.UserFullName[0] !></div>
					</div>
				   <%--<img src="<%=SenseNet.Portal.UI.UITools.GetAvatarUrl(User.Visitor)  %>/>--%>
				<% } else { %>
					
						<div class="post__general__avatar" style="background: url('<%=SenseNet.Portal.UI.UITools.GetAvatarUrl(createdby) %>') no-repeat center center;background-size: cover;">
						</div>
					
				<% } %> 
				<figcaption><%= createdby.FullName %></figcaption>
			</figure>
		</a>

		 <%-- Post body --%>
        <div class="post__article">
            <div class="post__info">
                <span class="post__info_date"> 
					<%= this.Content.ContentHandler.CreationDate.ToString()%>
                </span>

				<%-- Edit button --%>
				<sn:ActionLinkButton ID="ActionLinkButton1" runat="server"
					CssClass="btn btn--info edit--icon fi flaticon-pencil"
					IconVisible="false" 
					ActionName="Edit" 
					Text="Edit" />
            </div>
            <h2 class="post__title">
				<%= GetValue("DisplayName") %>
            </h2>

			<%-- Post text --%>
            <div class="post__text">
                <sn:RichText ID="RichText2" runat="server" FieldName="Body"/>
            </div>

            <div class="post__article_footer">

				<%--Tags--%>
                <div class="tags tags--article">
                    <ul>
						<% var tags = this.Content["Tags"] as string;
							if (string.IsNullOrEmpty(tags)) {
						%>	
								No tags for this post
						<% } else {
							var tagList = tags.Split(new string[] { SenseNet.KnowledgeBase.KnowledgeBaseHelper.LABELSEPARATOR }, StringSplitOptions.RemoveEmptyEntries).ToList();                       
							foreach (var tag in tagList)
							{ %>
								<li title="Show all articles for tag '<%= tag %>'">
									<a role="button" href='/?searchPhrase=<%= tag %>'>
										<%= tag %>
									</a>
								</li>
							<% }
						} %>
                    </ul>
                </div>

            </div>
        </div><%-- end post body --%>
    </div>

    <div class="post__comment_pannel js-comment_pannel" data-path="<%= path %>">
		<div>

			<div class="js-more post__comment_pannel__more" data-koef="10">more comments <!= item.CommentCount !></div>

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
					
					<textarea class="js-add_comment" data-path="<%= path %>" name="name" rows="2" cols="80"></textarea>
					<p>
						<small>press <strong>ctrl + Enter</strong> to send mesage</small>
					</p>
				</div>
			</div>
		</div>
    </div>

</aricle>


<%-- .js-modal is a global class for all modals --%>
<%-- .js-full_size is just for funtions that works with full screen img --%>
<div class="modal js-full_size js-modal">
	<div class="table_cu">
		<div class="table_cu__cell">
			<img src="" alt="ful size picture" />
			<button class="btn btn--round close js-close_modal">
				<i class="fi flaticon-delete"></i>
			</button>
		</div>
	</div>
</div>​