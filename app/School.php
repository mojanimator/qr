<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class School extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;

    protected $fillable = ['province_id', 'name', 'code_madrese', 'code_faza', 'sale_tasis', 'doore', 'tedad_daneshamooz'
        , 'vaziat', 'jensiat', 'tedad_paye_tahsili', 'tedad_hamkaran', 'noe_fazaye_amoozeshi', 'hooze_namayandegi_id',
        'schoolable_type', 'is_roozane', 'schoolable_id', 'created_at', 'updated_at'];

    protected $table = 'schools';

    public function schoolable()
    {
        return $this->morphTo('schoolable');
    }


    public function docs()
    {
        return $this->hasMany(Doc::class, 'school_id');
    }

    public function hooze()
    {
        return $this->belongsTo(Hooze::class, 'hooze_namayandegi_id');
    }
}
