// JavaScript source code
(function ($) {

    var defaults = {  // default values

        // global
        name        : "property_1", // string
        text        : "text",   // string
        removetext   : "Remove",

        // accessibility
        alabel      : "select ", // string

        //
        data : {
        	one : "Add some tags"
        },

        data_used: {
        	one: "lucene"
        },

    	// text 
        used_text: "Choisen tags",
        avalible_text: "List of avalible tags. Click on tag to use it.",
		input_text : "Enter the name of the tag that you search or add new tag",

        // callbacks
        created     : function () {},  // call back
        change      : function () {},  // call back
        removeTag   : function () {}  // call back
    };

    function Tagcloud(elements, options) {  // constructor
        // init parameters
        var widget = this;
        widget.config = $.extend({}, defaults, options);
        widget.elements = elements;
        widget.init();
        widget.elementsEvents();

        // if plugin was called with string option
        if (typeof options === "string") {
            switch (options) {
                case "method_1":
                    widget.method_1();
                    break;
                case "method_2":
                    widget.method_2();
                    break;
                case "something":
                    widget.something();
                    break;
                default: console.log('there is no bathroom');
            }
        }
    }

    Tagcloud.prototype.init = function () {
        // init function body ...
        /*
            here is the code for create elemts in plugin on first step
            this.config.property_1
            this.elements
        */
        this.elements.addClass('tagcloud'); // add a global class name
        var div = this.elements;

        $('<fieldset>', {
        	class: "tagcloud__used js-used"
        }).appendTo(this.elements);

        $('<legend>', {
        	class: "",
        	text: this.config.used_text
        }).appendTo(div.find('.js-used'));

        $('<label>', {
        	class: "",
        	text: this.config.input_text,
			for : "tagcloud_enter_name"
        }).appendTo(this.elements);

        $('<input>',{
        	"class": "tagcloud__field",
        	id: "tagcloud_enter_name"
        }).appendTo(this.elements);

        $('<p>', {
        	class: "",
        	text: this.config.avalible_text
        }).appendTo(this.elements);

        $('<ul>',{
            class : "tagcloud__list"
        }).appendTo(this.elements);

        $.each( this.config.data, function(item,index) {
        	$('<li>',{
        		text : $.trim(index),
        		"data-value": $.trim(index).replace(/ /g, "_"),
        		"data-index": item
            }).appendTo( div.find('ul') );
        } );

        this.config.created(this.elements); // callback after create elements
    }

    Tagcloud.prototype.elementsEvents = function () {
        var div = this.elements;
        var input = this.elements.find('input');
        var used = this.elements.find('.js-used');
        var li = this.elements.find('li');
        var span; // choisen tags
        var config = this.config; // options
        var input_value;

        // input events
        input.keyup(function (e) {
            input_value = input.val();
            if ( e.keyCode == 13 ) {
                // add tag to  the list
                var span = '<span class="tagcloud__choisen">' +
                                input_value +
                                '<button class="js-remove_tag tagcloud__choisen_remove fi flaticon-delete">' +
                                    '<span>' + config.removetext + '</span>' +
                                '</button>' +
                            '</span>';
                used.append(span);
                input.val('');
            }

            $.each( li, function(item) {
            	// do this if begin with entered letters
            	var tag_item = $(this).attr('data-value');
            	if (tag_item.indexOf(input_value) == 0 && input_value.length > 0) {
                    $(this).addClass('equal');
                } else {
                    $(this).removeClass('equal');
                }
            });
        });

        input.blur(function(){
            li.css('border','none');
        });
        // END input events

        div.on('click','.js-remove_tag',function() {
            $(this).parent().remove();
            var index = $(this).data('index');
            div.find('li[data-index='+ index +']').removeClass('used');
            config.removeTag(this); // callback after remove tag
        });

        li.on('click', function(){
            if ( !$(this).hasClass('used') ) {
                var tag = $(this).data('index');
                $(this).addClass('used');
                used.append(
                    '<span class="tagcloud__choisen" data-value="' + config.data[tag] + '">' +
                        config.data[tag] +
                        '<button class="js-remove_tag tagcloud__choisen_remove fi flaticon-delete" data-index="' + $(this).data('index') + '">' +
                            '<span>' + config.removetext + '</span>' +
                        '</button>' +
                    '</span>'
                );
            }
        });

    	// add tags to used tags list
        $.each(config.data_used, function (index, used) {
        	var result = $.trim(used).replace(/ /g, "_");
        	div.find('li[data-value=' + $.trim(result) + ']').click();
        });
    }

    // methods list
    Tagcloud.prototype.something = function () {
        console.log('something');
    }

    Tagcloud.prototype.method_1 = function () {
        console.log('method_1');
    }

    Tagcloud.prototype.method_2 = function () {
        console.log('method_2');
    }

    // ...
    // End methoids list

    $.fn.tagcloud = function (options) {

        this.each(function(){
            new Tagcloud($(this), options);  // call constuctor
        });
        // config.property_1
        return this.each(function(){

        });
    }
})(jQuery);
