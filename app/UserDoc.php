<?php

namespace App;

use DateTime;
use Faker\Provider\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Mockery\Exception;
use OwenIt\Auditing\Contracts\Auditable;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UserDoc extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'id', 'user_id', 'doc_type', 'path',

    ];
    protected $table = 'user_docs';

    protected $file;
    protected $fileType;

    protected $baseDir = '/userdocs';

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

    public static function getFile(string $file, string $docable_id, string $docable_type, string $filename)
    {

        $doc = new static;
        $doc->file = $file;
        $userID = auth()->user()->id;
        $name = sprintf("%s-%s-%s", urlencode(str_replace(' ', '_', $filename)), $userID, time());
        $doc->fill([
            'user_id' => $docable_id,
            'path' => $name,
//            'user_id' => $userID,
//            'thumbnail_path' => "tn-{$name}"
        ]);
//        $doc->associate(User::find($docable_id));
        return $doc;
    }

    public function uploadTemp()
    {
        $image_parts = explode(";base64,", $this->file);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);;
        $name = $this->tempDir() . '/' . $this->filename . '.' . $image_type_aux[1];
        // storing image in storage/app/public Folder
        Storage::disk('public')->put($name, $image_base64);
//        $this->file->move($this->tempDir(), $this->filename);

        return $this;
    }

    public function saveToTempDocsDB()
    {
        $date = new DateTime();
        DB::table('docs_temp')->insert(
            ['docable_id' => $this->docable_id, 'docable_type' => $this->docable_type, 'path' => $this->path,
                'user_id' => auth()->user()->id, 'created_at' => $date,]
        );


    }
}
