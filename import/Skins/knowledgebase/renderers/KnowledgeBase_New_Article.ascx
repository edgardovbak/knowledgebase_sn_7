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

<div class="js-add_image add_image" title="Choose image size and position">
	<div>
		<input class="js-range_img_size" type="range" value="50" min="0" max="100" />
		<span>50 %</span>
	</div>
	<div>
		<label for="img_float_left">
			Float left
		</label>
		<input class="js-img_float" id="img_float_left" value="0" type="radio" checked name="position" value="" />
		<label for="img_float_right">
			Float rigt
		</label>
		<input class="js-img_float" id="img_float_right" value="1" type="radio" name="position" value="" />
		<label for="img_position_center">
			Center
		</label>
		<input class="js-img_float" id="img_position_center" value="2" type="radio" name="position" value="" />
	</div>
</div>
