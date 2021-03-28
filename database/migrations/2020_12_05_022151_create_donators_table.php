<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDonatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('donators', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('app_id');
            $table->string('pay_id', 50)->nullable()->index();
            $table->string('order_id', 30)->nullable()->index();
            $table->string('name', 20);
            $table->integer('amount')->unsigned();
            $table->boolean('done')->default(false);
            $table->string('desc', 255)->nullable();
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
        Schema::dropIfExists('donators');
    }
}
