var Blog = new Class({
    options: {
        contentSelector: '.content',
        postSelector: '#post'
    },
    container: null,
    list: null,
    html: null,
    image: null,
    video: null,

    initialize: function (container, content, options) {
        $.extend(true, {}, this.options, options);
        this.container = $(container);
        this.content = $(content);
        this.image = this.content.find(this.options.contentSelector).find('img').first();
        this.video = this.content.find(this.options.contentSelector).find('iframe').first();

        if (this.video.length) {
            this.injectVideo();
        } else if (this.image.length) {
            this.injectImage();
        } else {
            this.injectGeneric();
        }
        this.container.trigger('blog-complete');
    },

    injectVideo: function () {
        var clone = this.video.clone();
        this.video.hide();
        this.video.closest('p').hide();
        if (this.image.length) {
            this.image.hide();
            this.image.closest('p').hide();
        }
        this.container.html('<div class="cover-wrap video"><div class="cover cheat-gutter embed-responsive embed-responsive-16by9">' + clone.prop('outerHTML') + '</div></div>');
        this.container.append('<div class="body">' + this.content.find(this.options.postSelector).html() + '</div>');
        this.container.trigger("blog-video-injected");
    },

    injectImage: function() {
        this.image.addClass('img-responsive');
        var clone = this.image.clone();
        this.image.hide();
        this.image.closest('p').hide();
        this.container.html("<div class='cover-wrap image cheat-gutter' style='background-image: url(" + this.image.attr("src") + ");'><div class='cover image'>" + clone.prop('outerHTML') + '</div></div>');
        this.container.append('<div class="body">' + this.content.find(this.options.postSelector).html() + '</div>');
        this.container.trigger("blog-image-injected");
    },

    injectGeneric: function() {
        this.container.html('<div class="body">' + this.content.find(this.options.postSelector).html() + '</div>');
    }
});