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
            var html = $(html).find(self.options.postContainerSelector).html();
            $(this).html(html);
        });
    },

    getParameter: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});