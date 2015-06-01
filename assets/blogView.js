var BlogView = new Class({
    options: {
        scrollBarWidth: 40,
        scrollerLeftSelector: '.scroller-left',
        scrollerRightSelector: '.scroller-right',
        listSelector: '.list',
        scrollSpeed: 'slow',
        fadeSpeed: 'slow',
        postContainerSelector: '#post',
        preloaderSelector: '#slider-preloader',
        postPreloaderSelector: '#post-preloader'
    },
    container: null,
    list: null,

    initialize: function (container, options) {
        $.extend(true, {}, this.options, options);
        this.container = $(container);
        this.list = $(this.container).find(this.options.listSelector);

        var initialPostUrl;
        var initialPostAnchor;
        this.list.find('div').each($.proxy(function(index, el){
            if ((this.getParameter('article') == $(el).find('a').attr('article-id')) || (!initialPostUrl)) {
                initialPostAnchor = $(el).find('a');
                initialPostUrl = $(el).find('a').attr('href');
                this.initialSlide = index;
            }

            $(el).find('a').click($.proxy(function(event) {
                event.preventDefault();
                var anchor = $(event.target);
                var href = anchor.attr('href');
                if (!href) {
                    var anchor = anchor.closest('a');
                    var href = anchor.attr('href');
                }
                this.loadPost(href, anchor);
            }, this));
        }, this));

        this.initSlick();
        this.loadPost(initialPostUrl, initialPostAnchor);
    },

    initSlick: function () {
        this.list.on('init', $.proxy(function(event, slick, direction){
            this.removePreloader();
        }, this));

        this.list.slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: this.initialSlide,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                    }
                },
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    },

    loadPost: function (url, anchor) {
        var self = this;
        $.ajax({
            url: url,
            context: $(this.options.postContainerSelector),
            beforeSend: function(xhr) {
                self.showPostPreloader();
            }
        }).done(function(html) {
            var html = $(html).find(self.options.postContainerSelector);
            var image = html.find('.content').find('img').first();
            var video = html.find('.content').find('iframe').first();

            self.container.find('.slick-track a').removeClass('active');
            anchor.addClass('active');

            if (video.length) {
                anchor.addClass('video');
                $(this).html(video);
                var clone = video.clone();
                video.hide();
                $(this).html('<div class="cover cheat-gutter embed-responsive embed-responsive-16by9">' + clone.prop('outerHTML') + '</div>');
            } else if (image.length) {
                image.addClass('img-responsive');
                var clone = image.clone();
                image.hide();
                $(this).html('<div class="cover cheat-gutter">' + clone.prop('outerHTML') + '</div>');
            } else {
                $(this).html('<div class="body">' + html.html() + '</div>');
                stButtons.locateElements();
                self.removePostPreloader();
                return;
            }
            $(this).append('<div class="body">' + html.html() + '</div>');
            stButtons.locateElements();
            self.removePostPreloader();
        });
    },

    getParameter: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    removePreloader: function () {
        $(this.options.preloaderSelector).hide();
        $(this.list).fadeIn();
    },

    showPostPreloader: function () {
        $(this.options.postContainerSelector).hide();
        $(this.options.postPreloaderSelector).fadeIn();
    },

    removePostPreloader: function () {
        $(this.options.postPreloaderSelector).hide();
        $(this.options.postContainerSelector).fadeIn();
    }
});