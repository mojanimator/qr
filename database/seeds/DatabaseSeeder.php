<?php

use App\Comment;
use App\Group;
use App\Post;
use App\Setting;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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


//        factory(Post::class, 20)->create();
//        factory(Comment::class, 40)->create();
//

        DB::table('users')->insert([
            ['id' => 1, 'username' => 'mojtaba', 'email' => 'moj2raj2@gmail.com', 'phone_number' => null,
                'first_name' => 'mojtaba', 'last_name' => 'rajabi', 'password' => '$2y$10$ES608U3ByfwiJlLmoJSYvuScaf2depjcMSk0PBNmCTCMMGX3J6EDW',
                'verified' => '1', 'role' => 'Admin', 'about' => "I'm freelance programmer and designer",
                'img' => "mojtaba.jpg", 'interests' => "['laravel', 'flutter', 'vue', 'football']",
                'likes' => 0, 'dislikes' => 0, 'posts' => 0,
                'token' => bin2hex(openssl_random_pseudo_bytes(30))],
            ['id' => 2, 'username' => 'samanamiri', 'email' => 'saman@gmail.com', 'phone_number' => null,
                'first_name' => 'saman', 'last_name' => 'amiri', 'password' => '$2y$10$ES608U3ByfwiJlLmoJSYvuScaf2depjcMSk0PBNmCTCMMGX3J6EDW',
                'verified' => '1', 'role' => 'User', 'about' => "I'm energy engineer",
                'img' => "samanamiri.jpg", 'interests' => "['solar', 'cinema', 'football']",
                'likes' => 0, 'dislikes' => 0, 'posts' => 0,
                'token' => bin2hex(openssl_random_pseudo_bytes(30))],
            ['id' => 3, 'username' => 'fakeuser', 'email' => 'fakeuser@gmail.com', 'phone_number' => null,
                'first_name' => 'fake', 'last_name' => 'user', 'password' => '$2y$10$ES608U3ByfwiJlLmoJSYvuScaf2depjcMSk0PBNmCTCMMGX3J6EDW',
                'verified' => '1', 'role' => 'User', 'about' => "I'm fake user",
                'img' => "fakeuser.jpg", 'interests' => "['fakes', 'hacking', 'basketball', 'c++']",
                'likes' => 0, 'dislikes' => 0, 'posts' => 0,
                'token' => bin2hex(openssl_random_pseudo_bytes(30))],
        ]);


        DB::table('settings')->insert([
            ['id' => 1, 'key' => 'created_qr', 'value' => 0], ['id' => 2, 'key' => 'visits', 'value' => 0],]);

    }
}
