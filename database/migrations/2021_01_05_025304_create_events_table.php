<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {


            $table->bigIncrements('id');
            $table->smallInteger('type')->unsigned()->default(1); //null means match
            $table->tinyInteger('app_id')->unsigned();
            $table->string('message', 50)->nullable();
            $table->timestamp('start_time');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
