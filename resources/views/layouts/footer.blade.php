<footer class="        ">
    <div class="footer-bg bg-dark-blue text-white    ">
        <div class="row  col-12    pb-2    ">
            <!-- footer logo -->
            <div class="col-md-4   text-left   text-center    ">

                <div class="text-center m-1 rounded p-4    h-100 "
                     style="background-color:#0b3b74 !important">
                    <div class="font-weight-bold mb-5 ">CONTACT</div>
                    <div><i class="fa fa-envelope "></i> moj2raj2@gmail.com</div>
                    <div class="d-flex justify-content-center my-2 px-3   ">
                        <a target="_blank" href="https://instagram.com/mojtaba___rajabi" class=" text-white mx-1">
                            <i class="fab fa-2x fa-instagram hoverable-light"></i>
                        </a>
                        <a target="_blank" href="https://telegram.me/mojraj" class=" text-white  mx-1">
                            <i class="fab fa-2x fa-telegram hoverable-light"></i>
                        </a>
                        <a target="_blank" href="https://wa.me/989176557299" class=" text-white  mx-1">
                            <i class="fab fa-2x fa-whatsapp hoverable-light"></i>
                        </a>
                        <a target="_blank" href="https://www.facebook.com/mojtaba.rajabi.18" class=" text-white  mx-1">
                            <i class="fab fa-2x fa-facebook hoverable-light"></i>
                        </a>
                    </div>
                </div>


            </div>

            <div class="footer-menu col-md-4      text-center   ">
                <div class="text-center m-1 rounded p-4 h-100  " style="background-color:#0b3b74 !important">
                    <div class="font-weight-bold mb-5 ">Powered By</div>

                    <div class="d-flex justify-content-center my-2 px-3   ">
                        <a target="_blank" href="https://github.com/SumiMakito/Awesome-qr.js" class=" text-white mx-1"
                           style="text-decoration: none">
                            <i class="fa fa-2x fa-qrcode hoverable-light"></i>
                            <p class="font-weight-bold  hoverable-light ">Awesome QR</p>
                        </a>
                        <a target="_blank" href="https://fengyuanchen.github.io/cropperjs/" class="  text-white  mx-1"
                           style="text-decoration: none">
                            <i class="fa fa-2x fa-crop hoverable-light"></i>
                            <p class="font-weight-bold  hoverable-light">Cropper JS</p>
                        </a>

                    </div>
                </div>
            </div>
            <div class="footer-menu col-md-4  px-2 text-center     ">
                <div class="text-center m-1 rounded p-4  h-100" style="background-color:#0b3b74 !important">
                    <div class="small text-left p-2">Send your Questions And Comments:</div>
                    <form id="comment-form" action="{{ route('comment') }}" method="POST"
                    >
                        {{ csrf_field() }}
                        <input class="form-control" name="email" type="text" placeholder="email"/>
                        <textarea name="body" type="" placeholder="comment"
                                  class="form-control border-all m-1 w-100 p-2"></textarea>

                        @if ($errors->has('email') || $errors->has('body'))
                            <strong class=" small   text-white">{{ $errors->first('email') ?: $errors->first('body') }}</strong>
                            <script> $('html,body').animate({scrollTop: $('footer').offset().top + 20}, 'slow');</script>

                        @elseif(Session::has('comment.success'))
                            <strong class="small   text-success">{{Session::get('comment.success')}}</strong>
                        @endif
                    </form>

                    <a class="btn btn-success btn-block"
                       onclick="event.preventDefault(); document.getElementById('comment-form').submit();"
                       href="{{route('comment')}}">
                        <i class="fa fa-search "></i>Send
                    </a>
                </div>
            </div>
            <!-- Foooter Text-->

        </div>
    </div>
    <div class="copyright-text row mx-0  justify-content-center  bg-dark   py-2 ">
        <h4 class=" "><a href="{{url('/')}}" target="_blank" class="text-white small ">
                All Rights Reserved For QR-Image-Creator.com</a>
        </h4>
        {{--<img src="/img/logo-white.png" style="width: 3rem;height: 3rem" alt=""></p>--}}
    </div>
</footer>

