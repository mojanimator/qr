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
    use SoftDeletes;

    protected $fillable = [
        'id', 'school_id', 'uploader_id', 'file_type', 'path',

    ];
    protected $table = 'docs';

    protected $file;
    protected $fileType;

    protected $baseDir = 'docs';

    public function baseDir()
    {
        return $this->baseDir;
    }

    public function tempDir()
    {
        return $this->baseDir . '/tmp';
    }

    public function docable()
    {
        return $this->morphTo();
    }

    public static function getFile(string $file, int $docable_id, string $docable_type, string $filename)
    {

        $doc = new static;
        $doc->file = $file;
        $userID = auth()->user()->id;
        $name = sprintf("%s-%s-%s", urlencode(str_replace(' ', '_', $filename)), $userID, time());
        $doc->fill([
            'school_id' => $docable_id,
            'path' => $name,
            'uploader_id' => $userID,
//            'thumbnail_path' => "tn-{$name}"
        ]);
//        $doc->associate(User::find($docable_id));
        return $doc;
    }

    public function upload()
    {
        $image_parts = explode(";base64,", $this->file);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);
        $path = $this->baseDir() . '/' . $this->path . '.' . $image_type_aux[1];
        $this->doc_type = $image_type_aux[1];
        $this->path = $path;
        // storing image in storage/app/public Folder
        Storage::disk('public')->put($path, $image_base64);
//        $this->file->move($this->tempDir(), $this->filename);

        return $this;
    }

    public function saveToDocsDB()
    {
        $date = new DateTime();
        DB::table('docs')->insert(
            ['school_id' => $this->school_id, 'doc_type' => $this->doc_type, 'path' => $this->path,
                'uploader_id' => auth()->user()->id, 'created_at' => $date, 'updated_at' => $date,]
        );


    }


}
