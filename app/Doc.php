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


class Doc extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    public $timestamps = false;
    protected $fillable = [
        'group_id', 'path', 'size', 'link',
    ];
    protected $table = 'docs';

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
