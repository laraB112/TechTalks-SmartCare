<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::statement("
            ALTER TABLE appointments
            MODIFY COLUMN status ENUM(
                'pending',
                'approved',
                'progress',
                'done',
                'rejected',
                'accepted',
                'in_progress',
                'completed',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");


        DB::table('appointments')
            ->where('status', 'approved')
            ->update(['status' => 'accepted']);

        DB::table('appointments')
            ->where('status', 'progress')
            ->update(['status' => 'in_progress']);

        DB::table('appointments')
            ->where('status', 'done')
            ->update(['status' => 'completed']);


        DB::statement("
            ALTER TABLE appointments
            MODIFY COLUMN status ENUM(
                'pending',
                'accepted',
                'rejected',
                'in_progress',
                'completed',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");


        Schema::table('appointments', function (Blueprint $table) {
            if (! Schema::hasColumn('appointments', 'accepted_at')) {
                $table->timestamp('accepted_at')
                    ->nullable()
                    ->after('status');
            }

            if (! Schema::hasColumn('appointments', 'rejected_at')) {
                $table->timestamp('rejected_at')
                    ->nullable()
                    ->after('accepted_at');
            }

            if (! Schema::hasColumn('appointments', 'started_at')) {
                $table->timestamp('started_at')
                    ->nullable()
                    ->after('rejected_at');
            }

            if (! Schema::hasColumn('appointments', 'completed_at')) {
                $table->timestamp('completed_at')
                    ->nullable()
                    ->after('started_at');
            }

            if (! Schema::hasColumn('appointments', 'rejection_reason')) {
                $table->string('rejection_reason')
                    ->nullable()
                    ->after('completed_at');
            }

            if (! Schema::hasColumn('appointments', 'consultation_notes')) {
                $table->text('consultation_notes')
                    ->nullable()
                    ->after('rejection_reason');
            }

            if (! Schema::hasColumn('appointments', 'cancelled_at')) {
                $table->timestamp('cancelled_at')
                    ->nullable()
                    ->after('consultation_notes');
            }

            if (! Schema::hasColumn('appointments', 'cancelled_by')) {
                $table->foreignId('cancelled_by')
                    ->nullable()
                    ->after('cancelled_at')
                    ->constrained('users')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('appointments', 'cancellation_reason')) {
                $table->string('cancellation_reason')
                    ->nullable()
                    ->after('cancelled_by');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        if (Schema::hasColumn('appointments', 'cancelled_by')) {
            Schema::table('appointments', function (Blueprint $table) {
                $table->dropConstrainedForeignId('cancelled_by');
            });
        }

        $columns = [
            'accepted_at',
            'rejected_at',
            'started_at',
            'completed_at',
            'rejection_reason',
            'consultation_notes',
            'cancelled_at',
            'cancellation_reason',
        ];

        foreach ($columns as $column) {
            if (Schema::hasColumn('appointments', $column)) {
                Schema::table('appointments', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }

        DB::statement("
            ALTER TABLE appointments
            MODIFY COLUMN status ENUM(
                'pending',
                'approved',
                'progress',
                'done',
                'rejected',
                'accepted',
                'in_progress',
                'completed',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");

        DB::table('appointments')
            ->where('status', 'accepted')
            ->update(['status' => 'approved']);

        DB::table('appointments')
            ->where('status', 'in_progress')
            ->update(['status' => 'progress']);

        DB::table('appointments')
            ->where('status', 'completed')
            ->update(['status' => 'done']);

        DB::table('appointments')
            ->where('status', 'cancelled')
            ->update(['status' => 'pending']);

        DB::statement("
            ALTER TABLE appointments
            MODIFY COLUMN status ENUM(
                'pending',
                'approved',
                'progress',
                'done',
                'rejected'
            ) NOT NULL DEFAULT 'pending'
        ");
    }
};