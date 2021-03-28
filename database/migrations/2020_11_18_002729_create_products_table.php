<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('info', 255)->nullable();
            $table->string('type', 10)->nullable()->index();
            $table->string('pay_id', 50)->nullable()->index();
            $table->string('order_id', 30)->nullable()->index();
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->string('name', 50)->nullable();
            $table->string('telegram_id', 20)->nullable();
            $table->smallInteger('step')->nullable()->default(0);
            $table->string('phone', 11)->nullable();
            $table->string('amount', 10)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
