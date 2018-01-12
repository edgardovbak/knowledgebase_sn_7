<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.Portlets.ContentCollectionView" %>

<header class="header">
    <div class="header__content">
        <div class="header__logo">
            <a href="/" aria-label="Home page">
                <img src="/Root/Skins/knowledgebase/images/logo.png" class="" alt="Logo">
            </a>
        </div>
        

        <div>                           
            <span><% 
                    if ((this.Parent as ContextBoundPortlet).ContextNode.Security.HasPermission(SenseNet.ContentRepository.Storage.Security.PermissionType.AddNew))
                    { %>
						<sn:ActionLinkButton runat="server" CssClass="btn header__button add-icon fi flaticon-add-page" ActionName="Add" 
							IconVisible="false" Text="New Article" ParameterString="ContentTypeName=KnowledgeBaseArticle_v_2" 
							NodePath="/Root/Sites/KnowledgeBaseSn7/Posts"  />                  
					<% } %>
                      
                      
            </span>            
        </div>
    </div>
</header>
