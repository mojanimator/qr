<?php

namespace App;

use DateTime;
use Faker\Provider\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Mockery\Exception;

use OwenIt\Auditing\Contracts\Auditable;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Database\Eloquent\SoftDeletes;


class Setting extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    public $timestamps = false;
    protected $fillable = [
        'key', 'value',
    ];
    protected $table = 'settings';

//    public function user()
//    {
//        return $this->belongsTo(User::class);
//    }
//    public function getValueAttribute($value)
//    {
//        dd($this->attributes['key']);
//        return intval($value);
//    }

}
