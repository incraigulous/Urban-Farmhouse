$(window).load(function(){

});

function process_content(item) {
    $(item).find('.blog-view').each(function(index, el) {
        new BlogView(el);
    });

    $(item).find('.slider').each(function(index, el) {

        function resetCaptionPositions() {
            $(el).find('.caption').each(function () {
                $(this).css('margin-top', -500);
            });
        }

        resetCaptionPositions();

        function showCaptionBox(currentSlide) {
            resetCaptionPositions();
            var caption = $(currentSlide).find('.caption');
            caption.animate({
                    'margin-top': 40
                }, 'slow');
        };

        $(el).on('init', function(event, slick, direction){
            var height = $('#slider-preloader').height();
            //while (height < 1) {
            //    var height = $('#slider-preloader').height();
            //}
            slick.$list.css('height',height);
            if (slick.$list.height() === 0) {
                alert('zero');
            }
            $('#slider-preloader').hide();
            $(el).fadeIn(500, function () {
                showCaptionBox(slick.$slides[slick.currentSlide]);
            });
        });

        $(el).on('afterChange', function(event, slick, currentSlide){
            showCaptionBox(slick.$slides[currentSlide]);
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
    $('a[data-hover="dropdown"]').click(function(){
        location.href = this.href;
    });

    process_content($('body'));
});