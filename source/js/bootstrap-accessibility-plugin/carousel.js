  // Carousel Extension
  // ===============================
  
$('.carousel').each(function (index) {
    var $this = $(this)
        , prev = $this.find('[data-slide="prev"]')
        , next = $this.find('[data-slide="next"]')
        , $options = $this.find('.item')
        , $listbox = $options.parent();

    $this.attr({ 'data-interval': 'false', 'data-wrap': 'false' });
    $listbox.attr('role', 'listbox');
    $options.attr('role', 'option');

    var spanPrev = document.createElement('span');
    spanPrev.setAttribute('class', 'sr-only');
    spanPrev.innerHTML = 'Previous';

    var spanNext = document.createElement('span');
    spanNext.setAttribute('class', 'sr-only');
    spanNext.innerHTML = 'Next';

    prev.attr('role', 'button');
    next.attr('role', 'button');

    prev.append(spanPrev);
    next.append(spanNext);

    $options.each(function () {
        var item = $(this);
        if (item.hasClass('active')) {
            item.attr({ 'aria-selected': 'true', 'tabindex': '0' });
        } else {
            item.attr({ 'aria-selected': 'false', 'tabindex': '-1' });
        }
    });
});

var slideCarousel = $.fn.carousel.Constructor.prototype.slide;
$.fn.carousel.Constructor.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active')
        , $next = next || $active[type]();

    slideCarousel.apply(this, arguments);

    $active
        .one($.support.transition.end, function () {
            $active.attr({ 'aria-selected': false, 'tabIndex': '-1' });
            $next.attr({ 'aria-selected': true, 'tabIndex': '0' });
            //.focus()
        });
};

$.fn.carousel.Constructor.prototype.keydown = function (e) {
    var $this = $(this)
        , $ul = $this.closest('div[role=listbox]')
        , $items = $ul.find('[role=option]')
        , $parent = $ul.parent()
        , k = e.which || e.keyCode
        , index
        , i;

    if (!/(37|38|39|40)/.test(k)) return;

    index = $items.index($items.filter('.active'));
    if (k === 37 || k === 38) {                           //  Up
        $parent.carousel('prev');
        index--;
        if (index < 0) index = $items.length - 1;
        else $this.prev().focus();

    }
    if (k === 39 || k === 40) {                          // Down
        $parent.carousel('next');
        index++;
        if (index === $items.length) index = 0;
        else {
            $this.one($.support.transition.end, function () {
                $this.next().focus();
            });
        }

    }

    e.preventDefault();
    e.stopPropagation();
};
$(document).on('keydown.carousel.data-api', 'div[role=option]', $.fn.carousel.Constructor.prototype.keydown);