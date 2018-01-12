<%@ Control Language="C#" AutoEventWireup="true" Inherits="SenseNet.Portal.UI.SingleContentView" %>

<script type="text/javascript" src="/Root/Skins/knowledgebase/scripts/tagCloud.js"></script>

<%--new Article--%>
<div class="sn-content-inlineview">
    <%--<sn:ErrorView ID="ErrorView1" runat="server" />--%>
    <div class="new_article">

		<%-- Title --%>
		<fieldset class="new_article__form">
			<legend>Title</legend>
			<div class="new_article__datetime">
				<%= DateTime.Now.ToString() %>
			</div>
			<sn:DisplayName ID="DisplayName" runat="server" FieldName="DisplayName" FrameMode="NoFrame" ControlMode="Edit">
                    <edittemplate>
                            <asp:PlaceHolder ID="ErrorPlaceHolder" runat="server"></asp:PlaceHolder>
                            <asp:TextBox ID="InnerShortText" CssClass="sn-content-title sn-article-title sn-wysiwyg-text sn-urlname-name" runat="server"></asp:TextBox>
                            <asp:TextBox ID="NameAvailableControl" runat="server" style="display:none"></asp:TextBox>
                        </edittemplate>
                </sn:DisplayName>
                <span style="display: none;">
                    <sn:Name ID="Name1" runat="server" FieldName="Name" ControlMode="Edit" />
                </span>
		</fieldset>
		<span style="display: none;">
            <sn:Name ID="Name" runat="server" FieldName="Name" ControlMode="Edit" />
        </span>

		<%-- Description --%>
		<fieldset class="new_article__editor">
			<legend>Description</legend>
			<sn:RichText ID="RichText2" ConfigPath="/Root/Global/plugins/BlogRichTextConfig.config" runat="server" FieldName="Body" Width="100%" Height="400px" ControlMode="Edit" FrameMode="NoFrame" />
		</fieldset>
    </div>

</div>

<div class="footer_button">
    <sn:CommandButtons ID="CommandButtons1" runat="server" HideButtons="Save CheckoutSave" />
</div>

