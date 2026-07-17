<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['hospital_id']);
            
            //  Then drop the column
            $table->dropColumn('hospital_id');
        });
    }

    public function down()
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('hospital_id')->constrained()->onDelete('cascade');
        });
    }
};