<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('username', 50)->unique()->nullable();
            $table->string('telegram_username', 50)->nullable();
            $table->string('telegram_id', 50)->nullable();
            $table->smallInteger('app_id')->unsigned()->nullable();
            $table->integer('responded')->unsigned()->default(0);
            $table->integer('trues')->unsigned()->default(0);
            $table->integer('score')->default(0);
            $table->integer('rank')->nullable();
            $table->string('role', 5)->default('User');
            $table->string('img', 50)->nullable()->default(null);
            $table->string('password', 255);
            $table->string('phones', 50)->nullable();
            $table->string('token')->nullable();
            $table->boolean('verified')->default(false);
            $table->smallInteger('step')->nullable()->default(0);
//            $table->integer('role_id')->unsigned()->default(3); //default regular user
            $table->softDeletes();
            $table->rememberToken();
//            $table->string('created_at');
//            $table->string('updated_at');
//            $table->bigInteger('loginCount')->default(0);

            $table->dateTime('expires_at')->nullable()->default(null);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();


//            $table->foreign('role_id')->references('id')->on('roles');

//            $table->timestamps();
        });
        DB::table('users')->insert([
            ['id' => 1, 'username' => 'mojtaba', 'telegram_username' => 'develowper',
                'telegram_id' => '72534783', 'app_id' => 1,
                'password' => Hash::make('123123'),
                'verified' => '1', 'role' => 'Admin', 'img' => "72534783.jpg",

                'token' => bin2hex(openssl_random_pseudo_bytes(30))],

        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        Schema::dropIfExists('banner_types');
        Schema::dropIfExists('users');
    }
}
