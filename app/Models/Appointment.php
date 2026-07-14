<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use App\Events\AppointmentStatusUpdated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'hospital_id',
        'specialization',
        'date',
        'time',
        'notes',
        'status',
        'checked_in_at',
        'accepted_at',
        'rejected_at',
        'started_at',
        'completed_at',
        'cancelled_at',
        'rejection_reason',
        'consultation_notes',
        'cancelled_by',
        'cancellation_reason',
    ];

    protected $casts = [
        'status' => AppointmentStatus::class,
        'date' => 'date',
        'checked_in_at' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(AppointmentStatusHistory::class);
    }

    public function cancelledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function scopeStatus($query, AppointmentStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function scopeForDoctor($query, int $doctorId)
    {
        return $query->where('doctor_id', $doctorId);
    }

    public function getQueuePositionAttribute(): int
    {
        return self::query()
            ->where('doctor_id', $this->doctor_id)
            ->whereDate('date', $this->date)
            ->whereNotIn('status', [
                AppointmentStatus::REJECTED->value,
                AppointmentStatus::COMPLETED->value,
                AppointmentStatus::CANCELLED->value,
            ])
            ->where('time', '<=', $this->time)
            ->count();
    }

    public function transitionTo(
        AppointmentStatus $target,
        ?User $performedBy = null,
        ?string $note = null
    ): void {
        $currentStatus = $this->status;

        if (! $currentStatus->canTransitionTo($target)) {
            throw new \DomainException(
                "Cannot transition appointment from {$currentStatus->label()} to {$target->label()}."
            );
        }

        DB::transaction(function () use (
            $target,
            $performedBy,
            $note,
            $currentStatus
        ) {
            $this->status = $target;

            switch ($target) {
                case AppointmentStatus::ACCEPTED:
                    $this->accepted_at = now();
                    break;

                case AppointmentStatus::REJECTED:
                    $this->rejected_at = now();

                    if ($note !== null) {
                        $this->rejection_reason = $note;
                    }

                    break;

                case AppointmentStatus::IN_PROGRESS:
                    $this->started_at = now();
                    break;

                case AppointmentStatus::COMPLETED:
                    $this->completed_at = now();

                    if ($note !== null) {
                        $this->consultation_notes = $note;
                    }

                    break;

                case AppointmentStatus::CANCELLED:
                    $this->cancelled_at = now();
                    $this->cancelled_by = $performedBy?->id;

                    if ($note !== null) {
                        $this->cancellation_reason = $note;
                    }

                    break;
            }

            $this->save();

            $this->statusHistories()->create([
                'from_status' => $currentStatus->value,
                'to_status' => $target->value,
                'changed_by' => $performedBy?->id,
                'note' => $note,
            ]);
        });

        $this->refresh();

        AppointmentStatusUpdated::dispatch(
            $this,
            $currentStatus,
            $target
        );
    }
}