<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::create('appointments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
        $table->foreignId('hospital_id')->constrained('hospitals')->onDelete('cascade');
        $table->string('specialization');
        $table->date('date');
        $table->time('time');
        $table->text('notes')->nullable();
        $table->enum('status', ['pending', 'approved', 'progress', 'done', 'rejected'])->default('pending');
        $table->timestamp('checked_in_at')->nullable();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
