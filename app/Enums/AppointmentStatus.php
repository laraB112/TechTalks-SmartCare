<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case PENDING     = 'pending';
    case ACCEPTED    = 'accepted';
    case REJECTED    = 'rejected';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED   = 'completed';
    case CANCELLED   = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING     => 'Pending',
            self::ACCEPTED    => 'Accepted',
            self::REJECTED    => 'Rejected',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED   => 'Completed',
            self::CANCELLED   => 'Cancelled',
        };
    }

    public static function allowedTransitions(): array
    {
        return [
            self::PENDING->value     => [self::ACCEPTED, self::REJECTED, self::CANCELLED],
            self::ACCEPTED->value    => [self::IN_PROGRESS, self::CANCELLED],
            self::IN_PROGRESS->value => [self::COMPLETED],
            self::REJECTED->value    => [],
            self::COMPLETED->value   => [],
            self::CANCELLED->value   => [],
        ];
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, self::allowedTransitions()[$this->value] ?? [], true);
    }
}
