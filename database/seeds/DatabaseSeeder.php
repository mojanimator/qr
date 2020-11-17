<?php

use App\Comment;
use App\Group;
use App\Post;
use App\Setting;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

//        Post::truncate();
//        Comment::truncate();
//        Group::truncate();
        User::truncate();
        Setting::truncate();

        Group::truncate();


//        factory(Post::class, 20)->create();
//        factory(Comment::class, 40)->create();
//

        DB::table('users')->insert([
            ['id' => 1, 'username' => 'mojtaba', 'telegram_username' => 'develowper',
                'telegram_id' => '72534783', 'app_id' => 1,
                'password' => Hash::make('123123'),
                'verified' => '1', 'role' => 'Admin', 'img' => "72534783.jpg",

                'token' => bin2hex(openssl_random_pseudo_bytes(30))],

        ]);


        DB::table('settings')->insert([
            ['id' => 1, 'key' => 'fashion_images', 'value' => 0], ['id' => 2, 'key' => 'fashion_visits', 'value' => 0],]);

        DB::table('groups')->insert([
                ['name' => 'women',],
                ['name' => 'men',],
                ['name' => 'child',],
                ['name' => 'home',],
                ['name' => 'esteghlal_p',],
                ['name' => 'perspolis_p',],
                ['name' => 'esteghlal_l',],
                ['name' => 'perspolis_l',],
                ['name' => 'romanbelize',],
                ['name' => 'legends',],
                ['name' => 'wolves',],
                ['name' => 'everton',],
                ['name' => 'manchester',],
                ['name' => 'car',],
                ['name' => 'motor',],
                ['name' => 'animal',],
                ['name' => 'film',],
                ['name' => 'animation',],
                ['name' => 'football',],
                ['name' => 'atelier-demo',],
                ['name' => 'game',],
                ['name' => 'psg',],
                ['name' => 'milan',],
                ['name' => 'bayern',],
                ['name' => 'tottenham',],
                ['name' => 'chelsea',],
                ['name' => 'city',],
                ['name' => 'arsenal',],
                ['name' => 'liverpool',],
                ['name' => 'premiere',],
                ['name' => 'barca',],
                ['name' => 'real',],
                ['name' => 'lester',],
            ]
        );


    }
}
