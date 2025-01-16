<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemInstance extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_instance', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('question_number');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('test_instance_id');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->string('answer', 1)->nullable();

            $table->foreign('item_id')->references('id')->on('item_bank');
            $table->foreign('test_instance_id')->references('id')->on('test_instance');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('item_instance');
    }
}
