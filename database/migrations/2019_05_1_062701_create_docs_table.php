<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::create('docs', function (Blueprint $table) {
//            $table->increments('id');
//            $table->integer('school_id')->unsigned();
//            $table->integer('uploader_id')->unsigned();
//            $table->string('doc_type');
//            $table->string('path');
//
//            $table->timestamps();
//            $table->softDeletes();
//            $table->foreign('school_id')->references('id')->on('schools');
//            $table->foreign('uploader_id')->references('id')->on('users');
//        });
//
//        Schema::create('user_docs', function (Blueprint $table) {
//            $table->increments('id');
//            $table->integer('user_id')->unsigned();
//            $table->string('doc_type', 20);
//            $table->string('path');
//            $table->timestamps();
//
//            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
//
//
//        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        Schema::dropIfExists('docs');
//        Schema::dropIfExists('docs_temp');
    }
}
