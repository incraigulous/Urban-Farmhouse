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
        this.list.find('div').each($.proxy(function(index, el){
            if ((this.getParameter('article') == $(el).find('a').attr('article-id')) || (!initialPostUrl)) {
                initialPostUrl = $(el).find('a').attr('href');
                this.initialSlide = index;
            }

            $(el).find('a').click($.proxy(function(event) {
                event.preventDefault();
                var href = $(event.target).attr('href');
                if (!href) {
                    var href = $(event.target).closest('a').attr('href');
                }
                this.loadPost(href);
            }, this));
        }, this));

        this.initSlick();
        this.loadPost(initialPostUrl);
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

    loadPost: function (url) {
        var self = this;
        $.ajax({
            url: url,
            context: $(this.options.postContainerSelector),
            beforeSend: function(xhr) {
                self.showPostPreloader();
            }
        }).done(function(html) {
            var image = $(html).find(self.options.postContainerSelector).find('img').first();
            var video = $(html).find(self.options.postContainerSelector).find('iframe').first();
            var html = $(html).find(self.options.postContainerSelector).html();

            if (video.length) {
                $(this).html(video);
            } else if (image.length) {
                $(this).html(image);
            } else {
                $(this).html(html);
                self.removePostPreloader();
                return;
            }

            $(this).append(html);

            if (video.length) {
                $(this).find('iframe:eq(1)').hide();
            } else if (image.length) {
                $(this).find('img:eq(1)').hide();
            }

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