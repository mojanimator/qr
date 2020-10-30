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
            ['id' => 1, 'username' => 'mojtaba', 'email' => 'moj2raj2@gmail.com',
                'password' => Hash::make('123123'),
                'verified' => '1', 'role' => 'Admin', 'img' => "mojtaba.jpg",

                'token' => bin2hex(openssl_random_pseudo_bytes(30))],

        ]);


        DB::table('settings')->insert([
            ['id' => 1, 'key' => 'fashion_images', 'value' => 0], ['id' => 2, 'key' => 'fashion_visits', 'value' => 0],]);

        DB::table('groups')->insert([
            ['name' => 'women',], ['name' => 'men',], ['name' => 'child',], ['name' => 'home',],]);

        DB::table('users')->insert([
            ['id' => 1, 'name' => 'questions', 'app_id' => 1, 'value' => 0],
            ['id' => 2, 'name' => 'trues', 'app_id' => 1, 'value' => 0],
            ['id' => 3, 'name' => 'questions', 'app_id' => 2, 'value' => 0],
            ['id' => 4, 'name' => 'trues', 'app_id' => 2, 'value' => 0],
            ['id' => 5, 'name' => 'questions', 'app_id' => 3, 'value' => 0],
            ['id' => 6, 'name' => 'trues', 'app_id' => 3, 'value' => 0],
            ['id' => 7, 'name' => 'questions', 'app_id' => 4, 'value' => 0],
            ['id' => 8, 'name' => 'trues', 'app_id' => 4, 'value' => 0],


        ]);

    }
}
