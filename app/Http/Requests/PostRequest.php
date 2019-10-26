<?php

namespace App\Http\Requests;

use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {


        $rules = [
            'recaptcha' => ['required', new  Recaptcha()],
            'title' => 'required|min:5|max:100' . $this->mode == 'create' ? "|unique:posts,title" : '',
            'slug' => "required|alpha_dash|min:5|max:255" . $this->mode == 'create' ? "|unique:posts,slug" : "|unique:posts,slug,$this->id",
            'body' => "required|min:5|max:65535",


        ];
//        if ($isKoochroo) {
//            $rules ["docs"] = "sometimes|array|between:1,2";
//            $rules ["docs.*"] = "base64_image|base64_size:2048";
//            $rules ["docs.*"] = "base64_image|base64_size:2048";
//            $rules ["docs.*"] = "base64_image|base64_size:2048";
//            $rules ["docs.*"] = "base64_image|base64_size:2048";
//        }
        return $rules;
    }

    public function messages()
    {
//        $isAgent = $this->input('is_agent');

        $messages = [
            'recaptcha.required' => 'لطفا گزینه من ربات نیستم را تایید نمایید',

            'sName.required' => 'نام مدرسه ضروری است',
            'sName.unique' => 'نام مدرسه تکراری است',
            'sName.max' => 'حداکثر طول نام مدرسه 100 کاراکتر است',

            'hooze.numeric' => 'مقدار حوزه نمایندگی نامعتبر است',
            'hooze.min' => 'حوزه نامعتبر است',
            'hooze.max' => 'حوزه نامعتبر است',

            'code_madrese.numeric' => 'کد مدرسه نامعتبر است',
            'code_madrese.min' => 'کد مدرسه نامعتبر است',
            'code_madrese.max' => 'کد مدرسه نامعتبر است',

            'code_faza.numeric' => 'کد فضا نامعتبر است',
            'code_faza.min' => 'کد فضا نامعتبر است',
            'code_faza.max' => 'کد فضا نامعتبر است',

            'sale_tasis.numeric' => 'سال تاسیس نامعتبر است',
            'sale_tasis.min' => 'سال تاسیس نامعتبر است',
            'sale_tasis.max' => 'سال تاسیس نامعتبر است',

            'tedad_daneshamooz.numeric' => 'تعداد دانش آموز نامعتبر است',
            'tedad_daneshamooz.min' => 'تعداد دانش آموز نامعتبر است',
            'tedad_daneshamooz.max' => 'تعداد دانش آموز نامعتبر است',

            'tedad_paye_tahsili.numeric' => 'تعداد پایه تحصیلی نامعتبر است',
            'tedad_paye_tahsili.min' => 'تعداد پایه تحصیلی نامعتبر است',
            'tedad_paye_tahsili.max' => 'تعداد پایه تحصیلی نامعتبر است',

            'tedad_hamkaran.numeric' => 'تعداد همکاران نامعتبر است',
            'tedad_hamkaran.min' => 'تعداد همکاران نامعتبر است',
            'tedad_hamkaran.max' => 'تعداد همکاران نامعتبر است',

            'is_roozane.boolean' => 'روزانه/شبانه نامعتبر است',
            'doore.in' => 'دوره نامعتبر است',
            'jensiat.in' => 'جنسیت نامعتبر است',
            'noe_faza.in' => 'نوع فضا نامعتبر است',
            'zamime.regex' => 'ضمیمه نامعتبر است',
            'schoolable_type.in' => 'نوع نامعتبر است',

            'loc1.pos.regex' => 'مکان ۱ روی نقشه نامعتبر است',
            'loc1.fasele_az_shahrestan.numeric' => 'فاصله از شهرستان مکان ۱  نامعتبر است',
            'loc1.fasele_az_shahrestan.min' => 'فاصله از شهرستان مکان ۱  نامعتبر است',
            'loc1.fasele_az_shahrestan.max' => 'فاصله از شهرستان مکان ۱  نامعتبر است',
            'loc1.address.max' => 'آدرس مکان ۱  نامعتبر است',

            'loc2.pos.regex' => 'مکان ۲ روی نقشه نامعتبر است',
            'loc2.fasele_az_shahrestan.numeric' => 'فاصله از شهرستان مکان ۲  نامعتبر است',
            'loc2.fasele_az_shahrestan.min' => 'فاصله از شهرستان مکان ۲  نامعتبر است',
            'loc2.fasele_az_shahrestan.max' => 'فاصله از شهرستان مکان ۲  نامعتبر است',
            'loc2.address.max' => 'آدرس مکان ۲  نامعتبر است',
            'loc2.masafate_kooch.numeric' => 'مسافت کوچ  نامعتبر است',
            'loc2.masafate_kooch.min' => 'مسافت کوچ  نامعتبر است',
            'loc2.masafate_kooch.max' => 'مسافت کوچ  نامعتبر است',
            'loc2.masire_kooch.max' => 'مسیر کوچ  نامعتبر است',
            'loc2.koochro_type.in' => 'نوع مدرسه کوچ رو نامعتبر است',

            'delDocs.between' => 'تعداد تصاویر حذفی نامعتبر است',
            'delDocs.*.numeric' => 'مقدار تصاویر حذفی نامعتبر است',
            'delDocs.array' => 'نوع تصاویر حذفی نامعتبر است',

            'docs.between' => 'تعداد تصاویر نامعتبر است',
            'docs.*.base64_image' => 'فرمت تصویر نا معتبر است',
            'docs.*.base64_size' => 'حجم تصویر حداکثر 2MB باشد',


        ];
//        if ($isAgent) {
//
//        }
        return $messages;

    }
}
