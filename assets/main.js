$(window).load(function(){

});

function process_content(item) {

    $(item).find('.blog-view').each(function(index, el) {
        new BlogView(el);
    });
}

$(document).ready(function() {
    process_content($('body'));
});