<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    protected $fillable = ['user_id', 'group_id', 'title', 'slug', 'body', 'likes', 'dislikes', 'tags', 'publish_at', 'published'];

    protected $casts = [
        'tags' => 'array',
     
    ];

    public function user()
    {
        return $this->belongsTo(User::class)/*->select(array('id', 'username'))*/
            ;

    }

    public function group()
    {
//        $ids = explode("$", $this->group_id);
        return $this->belongsTo(Group::class);

    }

    public function comments()
    {
        return $this->hasMany(Comment::class);

    }
}
