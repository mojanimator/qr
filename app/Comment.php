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


class Comment extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    public $timestamps = false;
    protected $fillable = [
        'id', 'email', 'body', 'ip_address', 'user_agent', 'created_at',
    ];
    protected $table = 'comments';

//    public function user()
//    {
//        return $this->belongsTo(User::class);
//    }


}
