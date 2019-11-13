let a = 0;
$('.banner-anchor').click(function () {
    $('html,body').animate({scrollTop: $("#" + 'uploader').offset().top - 20}, 'slow');
});
// $(window).scroll(function () {

let oTop = $('#counter').offset().top - window.innerHeight;
if (a === 0 && $(window).scrollTop() > oTop) {
    $('.counter-value').each(function () {
        let $this = $(this),
            countTo = $this.attr('data-count');
        $({
            countNum: $this.text()
        }).animate({
                countNum: countTo
            },

            {

                duration: 1000,
                easing: 'swing',
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum + "   QR Created Until Now !");
                    //alert('finished');
                }

            });
    });
    a = 1;
}

// });

// ************************uploader
// $(document).ready(function () {
//
//     $('input[type="file"]').ezdz();
//
//     console.log(document.location.hostname);
//
// });
// ************************fields validation

(function (exports) {
    function valOrFunction(val, ctx, args) {
        if (typeof val == "function") {
            return val.apply(ctx, args);
        } else {
            return val;
        }
    }

    function InvalidInputHelper(input, options) {
        input.setCustomValidity(valOrFunction(options.defaultText, window, [input]));

        function changeOrInput() {
            if (input.value == "") {
                input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
            } else {
                input.setCustomValidity("");
            }
        }

        function invalid() {
            if (input.value == "") {
                input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
            } else {
                input.setCustomValidity(valOrFunction(options.invalidText, window, [input]));
            }
        }

        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
    }

    exports.InvalidInputHelper = InvalidInputHelper;
})(window);
