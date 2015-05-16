var BlogView = new Class({
    options: {
        scrollBarWidth: 40,
        scrollerLeftSelector: '.scroller-left',
        scrollerRightSelector: '.scroller-right',
        listSelector: '.list',
        scrollSpeed: 'slow',
        fadeSpeed: 'slow',
        postContainerSelector: '#post'
    },
    container: null,
    leftScroller: null,
    rightScroller: null,
    list: null,
    width: null,
    url: null,
    data: {},

    initialize: function (container, options) {
        $.extend(true, {}, this.options, options);
        this.container = $(container);
        this.leftScroller =  $(this.container).find(this.options.scrollerLeftSelector);
        this.rightScroller =  $(this.container).find(this.options.scrollerRightSelector);
        this.list = $(this.container).find(this.options.listSelector);

        this.reAdjust();
        var firstPostUrl;

        this.list.find('li').each($.proxy(function(index, el){
            if (!firstPostUrl) {
                firstPostUrl = $(el).find('a').attr('href');
            }
            $(el).find('a').click($.proxy(function(event) {
                event.preventDefault();
                this.loadPost($(event.target).attr('href'));
            }, this));
        }, this));

        this.loadPost(firstPostUrl);

        this.list.find('li').each($.proxy(function(index, el){
            this.setThumbnailBackground(el);
        }, this));

        $(window).on('resize', $.proxy(function(e){
            this.reAdjust();
        }, this));

        this.rightScroller.click($.proxy(function() {
            this.scrollRight();
        }, this));

        this.leftScroller.click($.proxy(function() {
            this.scrollLeft();
        }, this));
    },

    scrollRight: function () {
        this.leftScroller.fadeIn(this.options.fadeSpeed);
        this.rightScroller.fadeOut(this.options.fadeSpeed);

        this.list.animate({left:"+=" + this.getHiddenWidth() + "px"},this.options.scrollSpeed,function(){

        });
    },

    scrollLeft: function () {
        this.rightScroller.fadeIn(this.options.fadeSpeed);
        this.leftScroller.fadeOut(this.options.fadeSpeed);

        this.list.animate({left:"-=" + this.getLeftPosition() + "px"},this.options.scrollSpeed,function(){

        });
    },

    getListWidth: function () {
        var itemsWidth = 0;
        this.list.find('li').each(function(){
            var itemWidth = $(this).outerWidth();
            itemsWidth+=itemWidth;
        });
        return itemsWidth;
    },

    getHiddenWidth: function () {
        return ((this.container.outerWidth())-this.getListWidth()-this.getLeftPosition())-this.options.scrollBarWidth;
    },

    getLeftPosition: function() {
        return this.list.position().left;
    },

    reAdjust: function() {
        if ((this.container.outerWidth()) < this.getListWidth()) {
            this.rightScroller.show();
        } else {
            this.rightScroller.hide();
        }

        if (this.getLeftPosition()<0) {
            $(this.leftScroller).show();
        } else {
            //$('.item').animate({left:"-=" + this.getLeftPosition() + "px"},this.options.scrollSpeed);
            this.leftScroller.hide();
        }
    },

    setThumbnailBackground: function (element) {
        var self = this;
        $.ajax({
            url: $(element).find('a').attr('href'),
            context: element
        }).done(function(html) {
            var body = $(html).find(self.options.postContainerSelector);
            var src = body.find('img').first().attr('src');
            if (src) {
                $(this).find('a').css('background-image', 'url(' + src + ')');
            }
        });
    },

    loadPost: function (url) {
        var self = this;
        $.ajax({
            url: url,
            context: $(this.options.postContainerSelector)
        }).done(function(html) {
            var html = $(html).find(self.options.postContainerSelector).html();
            $(this).html(html);
        });
    }
});