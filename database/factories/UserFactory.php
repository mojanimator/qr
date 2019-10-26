<?php

use App\Comment;
use App\Doc;
use App\Koochro;
use App\Post;
use App\Saabet;
use App\School;
use App\User;

use Illuminate\Support\Str;
use Faker\Generator as Faker;


$factory->define(Post::class, function (\Faker\Generator $faker) {
    $date = time();
    return [
        'user_id' => $faker->numberBetween(1, 3),
        'group_id' => $faker->numberBetween(1, 10), //group$sub
        'title' => $faker->sentence,
        'slug' => $faker->slug,
        'body' => $faker->realText(100),
        'likes' => 0,
        'dislikes' => 0,
        'tags' => $faker->randomElement([['tutorial', 'programming', 'php'], ['foods', 'delicious'], ['programming', 'java']],
            "['programming', 'vue', 'frontend', 'design']"),
        'publish_at' => $faker->dateTime,
        'is_published' => $faker->randomElement([true/*, false*/]),
        'created_at' => $date,
        'updated_at' => $date,
    ];
});

$factory->define(Comment::class, function (\Faker\Generator $faker) {
    $date = time();
    return [
        'user_id' => $faker->numberBetween(1, 3),
        'post_id' => $faker->numberBetween(1, 20),
        'root_id' => $faker->randomElement([null, null, $faker->numberBetween(1, 20), $faker->numberBetween(1, 20)]), //root !=null is reply to comment
        'body' => $faker->realText(50),
        'likes' => 0,
        'dislikes' => 0,
        'is_published' => true,
        'created_at' => $date,
        'updated_at' => $date,
    ];
});
