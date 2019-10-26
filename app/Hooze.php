<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Hooze extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = ['name', 'parent_id'];

    protected $table = 'hoozes';

    public function parent()
    {
//        return $this->belongsTo(User::class, 'user_id'); //if function name was not user
        return $this->belongsTo(Hooze::class, 'parent_id');
    }

   
}
