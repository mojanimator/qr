<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->unsigned();
            $table->string('group_id', 10)->index();
            $table->string('title', 100)->index();
            $table->string('slug', 100)->index(); //have index in unique
            $table->text('body');//65535
            $table->integer('likes')->default(0)->unsigned();
            $table->integer('dislikes')->default(0)->unsigned();
            $table->string('tags')->nullable()->default(null)->index();
            $table->dateTime('publish_at')->default(\Carbon\Carbon::now())->index();
            $table->boolean('is_published')->default(false);

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
//            $table->foreign('group_id')->references('id')->on('groups');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
