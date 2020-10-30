<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuizzesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger('type_id')->unsigned()->index();
            $table->smallInteger('app_id')->unsigned()->index();
            $table->string('question', 100);
            $table->tinyInteger('score')->unsigned()->default(3);
            $table->string('response', 50)->nullable();
            $table->string('options', 200)->nullable();
            $table->boolean('is_predict')->unsigned();
            $table->integer('responded')->unsigned()->default(0);
            $table->integer('trues')->unsigned()->default(0);

            $table->timestamp('shows_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

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
        Schema::dropIfExists('quizzes');
    }
}
