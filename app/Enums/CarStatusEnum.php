<?php

namespace App\Enums;

/**
 * Enum CarStatusEnum
 *
 * This enumeration represents the different statuses a car can have within the system.
 * Each status is associated with a specific label and a corresponding Bootstrap color
 * class for frontend styling.
 *
 * @package App\Enums
 */
enum CarStatusEnum: string
{
    /**
     * The car is ready to be rented.
     *
     * @var string READY
     */
    case READY = 'ready';

    /**
     * The car is currently borrowed by a user.
     *
     * @var string BORROWED
     */
    case BORROWED = 'borrowed';

    /**
     * The car has been involved in a crash.
     *
     * @var string CRASH
     */
    case CRASH = 'crash';

    /**
     * The car is under repair.
     *
     * @var string REPAIR
     */
    case REPAIR = 'repair';

    /**
     * The car has been missing and no longer available to used or been searched.
     *
     * @var string MISSING
     */
    case MISSING = 'missing';

    /**
     * The car has been sold and is no longer available in the system.
     *
     * @var string SOLD
     */
    case SOLD = 'sold';

    /**
     * Get the human-readable label for each status.
     *
     * @return string The label representing the car status.
     */
    public function label(): string
    {
        return match ($this) {
            self::READY => 'Siap Dipinjamkan',
            self::BORROWED => 'Sudah Disewakan',
            self::CRASH => 'Rusak',
            self::REPAIR => 'Direparasi',
            self::MISSING => 'Hilang',
            self::SOLD => 'Terjual',
        };
    }

    /**
     * Get the Bootstrap color class for each status.
     *
     * @return string The Bootstrap class for color styling.
     */
    public function color(): string
    {
        return match ($this) {
            self::READY => 'success',
            self::BORROWED => 'primary',
            self::CRASH => 'danger',
            self::REPAIR => 'warning',
            self::SOLD => 'secondary',
            self::MISSING => 'dark',
        };
    }
}
