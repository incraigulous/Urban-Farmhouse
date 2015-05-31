$(window).load(function(){

});

function process_content(item) {
    $(item).find('.blog-view').each(function(index, el) {
        new BlogView(el);
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
}

$(document).ready(function() {
    $('a[data-hover="dropdown"]').click(function(){
        location.href = this.href;
    });

    $(".main-nav").on('affix.bs.affix', function(event) {
        $('body').addClass('nav-affixed');
    });

    $(".main-nav").on('affixed-top.bs.affix', function(event) {
        $('body').removeClass('nav-affixed');
    });

    $(".main-nav").affix({
        offset: {
            top: 140
        }
    });

    process_content($('body'));
});