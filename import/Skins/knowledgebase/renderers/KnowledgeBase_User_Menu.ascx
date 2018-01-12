﻿<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.Portlets.ContentCollectionView"  %>
<%	
	var content = SenseNet.ContentRepository.Content.Load(SenseNet.ContentRepository.User.Current.Path );
	var imgField = content.Fields["Avatar"] as SenseNet.ContentRepository.Fields.ImageField;
	imgField.GetData(); 
%>

<!-- PROFILE --> 
<div class="sidebar__profile">
   
		<% if (!string.IsNullOrEmpty(imgField.ImageUrl)) {
		%>
			<div class="sidebar__avatar" style="background: url(<%= imgField.ImageUrl %>) no-repeat center center;background-size: cover;">
			</div>
		<%} else {
		%>	
			<div class="sidebar__avatar">
				<div class="sidebar__avatar__placeholder"></div>
				<div class="sidebar__first__letter"><%= SenseNet.ContentRepository.User.Current.FullName[0] %></div>
			</div>
	    <% }
		%>
    
   <div class="sidebar__username">
   		<%= SenseNet.ContentRepository.User.Current.FullName %> 
   </div>
</div>

<!-- MENU -->
<div class="sidebar__menu">
    <h2 class="block__title">Profile</h2>
  	<ul>
      	<% 
          foreach (var action in SenseNet.ApplicationModel.ActionFramework.GetActions( SenseNet.ContentRepository.Content.Load ( SenseNet.ContentRepository.User.Current.Path ), "KnowledgebaseUserActions",null )) { %>
          	<li>
              <a 	href="<%= action.Uri %>" 
				  	aria-label="<%= action.Active ? "You are here" : "" %>" 
				  	class=" <%= action.Active ? "" : "" %>">
                	<%= action.Text %>
              </a>
          	</li>
        <% } %>
    </ul>
</div>