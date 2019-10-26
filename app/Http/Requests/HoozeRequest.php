<?php

namespace App\Http\Requests;

use App\Hooze;
use App\Rules\Recaptcha;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;


class HoozeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {

        if ($this->input('type') == 'edit')
            return Gate::allows('edit', [Hooze::class, $this->input('id')]);
        else if ($this->input('type') == 'create')
            return Gate::allows('create', 'App\Hooze');

        else  return true;
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
            'type' => 'required|in:edit,create',
            'name' => 'required|max:100|unique:hoozes,name' . $this->input('type') == 'edit' ? ',' . $this->input('id') : '',//unique except this id (edit)
            'parent_id' => 'nullable|numeric|exists:hoozes,id' . $this->input('type') == 'edit' ? '|different:id' : '', // not same with parent
        ];

        if ($this->input('type') == 'edit') {
            $rules['id'] = 'required|numeric|exists:hoozes,id';
        }

        return $rules;
    }

    public function messages()
    {
//        $isAgent = $this->input('is_agent');
        $messages = [

            'recaptcha.required' => 'لطفا گزینه من ربات نیستم را تایید نمایید',
            'type.required' => 'نوع ضروری است',
            'type.in' => 'نوع نامعتبر است',

            'name.required' => 'نام حوزه ضروری است',
            'name.unique' => 'نام حوزه تکراری است',
            'name.max' => 'حداکثر طول نام حوزه 100 کاراکتر است',
            'parent_id.numeric' => 'شناسه حوزه والد نامعتبر است',
            'parent_id.exists' => 'شناسه حوزه والد نامعتبر است',
            'parent_id.different' => ' حوزه و حوزه والد نمی توانند یکی باشند',
        ];

        if ($this->input('type') == 'edit') {
            $messages['id.numeric'] = 'شناسه حوزه نامعتبر است';
            $messages['id.exists'] = 'شناسه حوزه نامعتبر است';
            $messages['id.can'] = 'شناسه حوزه نامعتبر است';
        }
        return $messages;

    }
}
