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

    /**
     * Init the slick.js slider
     */
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

    /**
     * Get a post via AJAX and inject it into the post container.
     * @param url
     * @param anchor
     */
    loadPost: function (url, anchor) {
        var self = this;
        $.ajax({
            url: url,
            context: $(this.options.postContainerSelector),
            beforeSend: function(xhr) {
                self.showPostPreloader();
            }
        }).done(function(html) {
            self.container.find('.slick-track a').removeClass('active');
            anchor.addClass('active');

            $(this).on("blog-complete", function() {
                stButtons.locateElements();
                self.removePostPreloader();
            });

            var blog = new Blog(this, html);
        });
    },

    /**
     * Helper function to get URL params.
     * @param name
     * @returns {string}
     */
    getParameter: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    /**
     * Hide the preloader div.
     */
    removePreloader: function () {
        $(this.options.preloaderSelector).hide();
        $(this.list).fadeIn();
    },

    /**
     * Show the post preloader.
     */
    showPostPreloader: function () {
        $(this.options.postContainerSelector).hide();
        $(this.options.postPreloaderSelector).fadeIn();
    },

    /**
     * Hide the post preloader.
     */
    removePostPreloader: function () {
        $(this.options.postPreloaderSelector).hide();
        $(this.options.postContainerSelector).fadeIn();
    }
});