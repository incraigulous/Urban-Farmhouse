$(window).load(function(){

});

function process_content(item) {
    $(item).find('.blog-view').each(function(index, el) {
        new BlogView(el);
    });

    $(item).find('.blog-post').each(function(index, el) {
        var container = $(el).find('#post');

        $(container).on("blog-complete", function() {
            stButtons.locateElements();
            $('#post-preloader').hide();
            $('#post').fadeIn();
        });

        new Blog(container, $(el).clone());
    });

    $(item).find('.slider').each(function(index, el) {
        $(el).find('image').attr('height', $(el).height());
        $(el).find('image').attr('width', $(el).width());

        function showCaptionBox() {
            var caption = $(el).find('.caption');
            if (!caption.hasClass('shown')) {
                caption.fadeIn();
                caption.addClass('shown');
            }
        };

        $(el).on('init', function(event, slick, direction){
            var height = $('#slider-preloader').height();
            slick.$list.css('height',height);
            $('#slider-preloader').hide();
            $(el).fadeIn(500, function () {
                showCaptionBox();
            });
        });

        $(el).on('afterChange', function(event, slick, currentSlide){
            showCaptionBox(slick.$slides[currentSlide]);
        });

        $(el).slick({
            dots: true,
            infinite: true,
            speed: 600,
            slidesToShow: 1,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 7000
        });
    });

    $(item).find('.main-nav').each(function(index, el) {
        new Nav(el);
    });
}

$(document).ready(function() {
    process_content($('body'));
});