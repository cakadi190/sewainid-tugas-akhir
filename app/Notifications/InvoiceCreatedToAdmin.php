<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceCreatedToAdmin extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected readonly string $idTrx,
        protected readonly string $adminName
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Ada Pesanan Baru Nih!')
                    ->greeting("Hallo {$this->adminName}")
                    ->line('Halo Admin, ada pesanan baru nih! Coba kamu cek ke panel admin supaya tau rincian pesanannya.')
                    ->action('Cek di sini', route('administrator.booking.index', ['search' => $this->idTrx]));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Ada Pesanan Baru Nih!',
            'url' => route('administrator.booking.index', ['search' => $this->idTrx]),
            'message' => 'Ada pesanan baru untuk dicek!',
        ];
    }
}
