<?php

namespace App\Enums;

enum CarRepairNoteStatusEnum: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELED = 'canceled';

    public function label(): string
    {
        return match ($this) {
            CarRepairNoteStatusEnum::PENDING => 'Belum Dikerjakan',
            CarRepairNoteStatusEnum::IN_PROGRESS => 'Dalam Proses',
            CarRepairNoteStatusEnum::COMPLETED => 'Selesai',
            CarRepairNoteStatusEnum::CANCELED => 'Dibatalkan',
        };
    }

    public function color(): string
    {
        return match ($this) {
            CarRepairNoteStatusEnum::PENDING => 'bg-warning',
            CarRepairNoteStatusEnum::IN_PROGRESS => 'bg-primary',
            CarRepairNoteStatusEnum::COMPLETED => 'bg-success',
            CarRepairNoteStatusEnum::CANCELED => 'bg-danger',
        };
    }
}

