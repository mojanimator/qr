<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('infos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', '20');
            $table->smallInteger('app_id');
            $table->integer('value')->default(0);

        });

        DB::table('infos')->insert([
            ['id' => 1, 'app_id' => 1, 'name' => 'responses', 'value' => 0],
            ['id' => 2, 'app_id' => 1, 'name' => 'trues', 'value' => 0],
            ['id' => 3, 'app_id' => 1, 'name' => 'questions', 'value' => 0],
            ['id' => 4, 'app_id' => 2, 'name' => 'responses', 'value' => 0],
            ['id' => 5, 'app_id' => 2, 'name' => 'trues', 'value' => 0],
            ['id' => 6, 'app_id' => 2, 'name' => 'questions', 'value' => 0],
            ['id' => 7, 'app_id' => 3, 'name' => 'responses', 'value' => 0],
            ['id' => 8, 'app_id' => 3, 'name' => 'trues', 'value' => 0],
            ['id' => 9, 'app_id' => 3, 'name' => 'questions', 'value' => 0],
            ['id' => 10, 'app_id' => 4, 'name' => 'responses', 'value' => 0],
            ['id' => 11, 'app_id' => 4, 'name' => 'trues', 'value' => 0],
            ['id' => 12, 'app_id' => 4, 'name' => 'questions', 'value' => 0],

        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('infos');
    }
}
