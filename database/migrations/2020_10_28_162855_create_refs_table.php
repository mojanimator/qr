<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRefsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refs', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('user_id')->unsigned();

            $table->smallInteger('app_id')->index();
            $table->smallInteger('type_id')->index();
            $table->smallInteger('group_id')->index();
            $table->string('username', 50)->index();
            $table->string('title', 100)->nullable();
            $table->boolean('is_vip')->default(false);
            $table->string('main_color', 50)->nullable();

            $table->timestamp('expire_time')->nullable()->default(null);
            $table->timestamp('start_time')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('refs');
    }
}
