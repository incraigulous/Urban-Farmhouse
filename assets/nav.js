var Nav = new Class({
    options: {
        sticky: true,
        bodyAffixedClass: 'nav-affixed',
        affixTopOffset: 140
    },
    container: null,
    list: null,

    initialize: function (container, options) {
        $.extend(true, {}, this.options, options);
        this.container = $(container);

        //Make dropdown root clickable
        $('a[data-hover="dropdown"]').click(function(){
            location.href = this.href;
        });

        if (this.options.sticky) {
            this.initAffix();
        }
    },

    initAffix: function () {
        $(this.container).on('affix.bs.affix', $.proxy(function(event) {
            $('body').addClass(this.options.bodyAffixedClass);
        }, this));

        $(this.container).on('affixed-top.bs.affix', $.proxy(function(event) {
            $('body').removeClass(this.options.bodyAffixedClass);
        }, this));

        $(this.container).affix({
            offset: {
                top: this.options.affixTopOffset
            }
        });
    }
});