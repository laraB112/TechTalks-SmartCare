<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->date('requested_date')->nullable();
            $table->time('requested_time')->nullable();
            $table->timestamp('reschedule_requested_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'requested_date',
                'requested_time',
                'reschedule_requested_at',
            ]);
        });
    }
};