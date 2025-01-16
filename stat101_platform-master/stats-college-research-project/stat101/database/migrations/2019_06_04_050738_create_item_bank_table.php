<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemBankTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_bank', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('question_entity_id');
            $table->string('correct_answers', 1);
            $table->string('image')->nullable();

            $table->foreign('question_entity_id')->references('id')->on('question_entity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('item_bank');
    }
}
