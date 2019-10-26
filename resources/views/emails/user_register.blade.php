@component('mail::message')
@lang(' اطلاعات شما با موفقیت در سامانه مدارس عشایر کرمان ثبت شد') <br>

@lang('برای تکمیل ثبت نام روی دکمه زیر کلیک کنید')<br>

@component('mail::button', ['url' =>  route('verification.mail',['token'=>$email_token,'from'=>'register']) ,'color' => 'gradient'])
        تکمیل ثبت نام
@endcomponent


@lang('اگر دکمه را نمی بینید لینک زیر را در نوار آدرس مرورگر کپی کنید')
<br>
@lang(route('verification.mail',['token'=>$email_token,'from'=>'register']))
<br>
<br>
<br>
@lang(    'با تشکر')
    {{--سامانه مدارس عشایر کرمان--}}
{{ config('app.name') }}

@endcomponent
