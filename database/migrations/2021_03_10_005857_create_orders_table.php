<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('chat_username', 50)->index();
            $table->integer('follow_limit')->unsigned()->default(0);
            $table->integer('day_limit')->unsigned()->default(0);
            $table->integer('follow_now')->unsigned()->default(0);
            $table->integer('follow_score')->unsigned();
            $table->string('type', 1)->default('t');
            $table->boolean('done')->default(false);

            $table->timestamp('created_at')->useCurrent();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
