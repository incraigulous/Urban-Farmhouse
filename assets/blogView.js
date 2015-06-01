var BlogView = new Class({
    options: {
        scrollBarWidth: 40,
        scrollerLeftSelector: '.scroller-left',
        scrollerRightSelector: '.scroller-right',
        listSelector: '.list',
        scrollSpeed: 'slow',
        fadeSpeed: 'slow',
        postContainerSelector: '#post',
        preloaderSelector: '#slider-preloader'
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
                this.loadPost($(event.target).attr('href'));
            }, this));
        }, this));

        this.initSlick();
        this.loadPost(initialPostUrl);
    },

    initSlick: function () {
        this.list.on('init', $.proxy(function(event, slick, direction){
            $(this.options.preloaderSelector).hide();
            $(this.list).fadeIn(500);
            $(this.options.postContainerSelector).fadeIn(500);
        }, this));

        this.list.slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            initialSlide: this.initialSlide,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    },

    loadPost: function (url) {
        var self = this;
        $.ajax({
            url: url,
            context: $(this.options.postContainerSelector)
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
                return;
            }

            $(this).append(html);

            if (video.length) {
                $(this).find('iframe:eq(1)').hide();
            } else if (image.length) {
                $(this).find('img:eq(1)').hide();
            }
        });
    },

    getParameter: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});