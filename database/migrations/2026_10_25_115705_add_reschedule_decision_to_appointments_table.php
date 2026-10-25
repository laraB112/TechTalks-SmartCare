<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reschedule_decision')
                ->nullable()
                ->after('reschedule_requested_at');

            $table->timestamp('reschedule_decided_at')
                ->nullable()
                ->after('reschedule_decision');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'reschedule_decision',
                'reschedule_decided_at',
            ]);
        });
    }
};
