<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Saabet extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $fillable = ['address', 'loc', 'fasele_az_shahrestan'];

    protected $table = 'saabets';

    public function schools()
    {
        return $this->morphMany(School::class, 'schoolable');
    }
}
