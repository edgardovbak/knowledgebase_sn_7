<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.Portlets.ContentCollectionView" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="SenseNet.Portal.Portlets" %>
<%@ Import Namespace="SenseNet.Portal.Helpers" %>
<%@ Import Namespace="SenseNet.ContentRepository" %>
  
<% 
   String articlePath = this.Model.Content.Path;
   SenseNet.ContentRepository.Content tabContent = SenseNet.ContentRepository.Content.Load(articlePath);
	var tabNode = SenseNet.ContentRepository.Storage.Node.LoadNode(tabContent.Id);
%>	
  
     <article class="post js-post_id" id="post_id_<%=tabContent.Id %>" >
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
    </article>

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