$(window).load(function(){

});

function process_content(item) {

    $(item).find('.blog-view').each(function(index, el) {
        new BlogView(el);
    });

    $(item).find('.slider').each(function(index, el) {
        $(el).on('init', function(event, slick, direction){
            $(el).fadeIn();
        });

        $(el).slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 7000
        });
    });
}

$(document).ready(function() {
    process_content($('body'));
});