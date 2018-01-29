# sn_knowledgeBase v0.1.1

## What is that?

This theme was created with SenseNet ECM [sense.net](https://www.sensenet.com/).
To this package was added basic options to manage, search, comments articles.
Using knowledge template base you can create a simple blog.

## Chang log

	- Add pictures to article
	- Manage pictures size and position

This option you can  find when add new or edit article.
Press "Upload Image" button choose files and press "Upload". Close dialog window.
All  pictures that was added can find under the Editor.
Click on image and in dialog window choose size (%) and position in article. And press "Yes" button.


## How it work?

1. Instal Senese.net How to  install sensenet you can [find here](http://wiki.sensenet.com/How_to_install_Sense/Net)
2. Download this theme
3. Copy files from bin folder in package and paste to path_to_project/.../Site name/Admin/bin
4. Add to the Web.config, that you can find in path_to_project/.../Site name/Admin/bin  folder, and add to "<sensenet>" element this
``` xml
<portalSettings>
      <add key="AllowCssBundling" value="false" />
      <add key="AllowJsBundling" value="false" />
      <add key="JsBundlingBlacklist" value="/Root/Global/scripts/tinymce/;/Root/Global/scripts/jquery/plugins/tree/" />
      <add key="CssBundlingBlacklist" value="" />
      <add key="EditSourceExtensions" value=".ascx;.asmx;.eml;.config;.css;.js;.xml;.xaml;.html;.htm;.aspx;.template;.xslt;.txt;.ashx;.settings;.cshtml;.json;.vbhtml" />
      <add key="WebdavEditExtensions" value=".doc;.docx;.rtf;.xls;.xlsx;.ppt;.pptx;.xlsm;.xltx;.ods;.odt;.odp;.ppd;.ppsx;.rtf;.mpp" />
      <add key="CheckInComments" value="Recommended" />
      <add key="UserProfilesEnabled" value="true" />
      <add key="DenyCrossSiteAccessEnabled" value="true" />
    </portalSettings>
````
With this options you can use tinyMCE editor to manage articles.
5. Import downloaded package.
	- Run  command line
	- Go in to path_to_project/source/.../Site name/Admin/bin
	- Write
  ```
  SnAdmin import source:"localrepo\import" target:"/Root/"
  ```
Done.


## Theme capability

In this version you can only add, edit and delete articles.
Planned to add more options like:
	- Tags
	- Labels
	- Search
	- Comments
	- Notification


### Add

To add new article press "New article" button in header.
After that you will redirect to page where you can create new article.
On this page write Title and description for article, also can add labels, this is optional.
Labels help in searching.

To save new article press "SAVE" at the bottom of the page


### Edit

There is two ways to edit article.

1. Press "manage" button in the upper right corner, and choose edit menu item
2. Click on article title, after redirect on article page, press edit button.

To save all changes in article press "SAVE" at the bottom of the page


### Delete

If you want to  delete article press "manage" button in the upper right corner of article, and choose "Delete" menu item.
Then a modal window appears where you need to confirm the deletion.
