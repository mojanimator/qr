<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->index();
            $table->integer('num')->unsigned()->default(0);
            $table->timestamp('created_at')->useCurrent();


        });
        DB::table('groups')->insert([
            ['name' => 'women'],
            ['name' => 'men'],
            ['name' => 'child'],
            ['name' => 'home'],
            ['name' => 'esteghlal_p'],
            ['name' => 'perspolis_p'],
            ['name' => 'esteghlal_l'],
            ['name' => 'perspolis_l'],

        ]);


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
