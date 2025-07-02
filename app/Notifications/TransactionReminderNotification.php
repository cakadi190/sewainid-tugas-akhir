<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected readonly Transaction $transaction
    ) {}

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
            ->subject('Kamu Gapapa Kan? 🥺')
            ->greeting("Hai {$this->transaction->user->name},")
            ->line("Kami lihat tagihan #{$this->transaction->id} kamu belum dibayar nih. Kamu gapapa kan? Atau mungkin jaringannya lagi gangguan?")
            ->line('Kalau ada kendala, jangan sungkan hubungi kami ya. Tapi kalau memang lupa, kamu bisa klik tombol di bawah ini buat langsung lanjut pembayaran.')
            ->action('Bayar Sekarang', route('dashboard.transaction.show', $this->transaction->id))
            ->salutation('Tetap semangat dan terima kasih selalu 🙏');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Segera Dibayar Ya Kak!',
            'url' => route('dashboard.transaction.show', $this->transaction->id),
            'message' => 'Tagihanmu belum dibayar, segera lakukan pembayaran ya!',
        ];
    }
}
