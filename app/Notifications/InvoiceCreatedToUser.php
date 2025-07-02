<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceCreatedToUser extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected readonly string $name,
        protected readonly string $idTrx,
        protected readonly string $amount
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
        $formatCurrency = currency($this->amount);

        return (new MailMessage)
            ->subject("Tagihan Baru #{$this->idTrx}")
            ->greeting("Hai {$this->name} 👋")
            ->line("Ada tagihan baru nih buat kamu, dengan ID transaksi **#{$this->idTrx}**.")
            ->line("Total yang perlu dibayar: **{$formatCurrency}**")
            ->action('Cek Tagihannya', route('dashboard.transaction.show', $this->idTrx))
            ->line('Yuk segera diselesaikan pembayarannya biar prosesnya makin lancar!')
            ->line('Makasih udah pake layanan kami 🙌');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $formatCurrency = currency($this->amount);

        return [
            'title' => "Tagihan Baru #{$this->idTrx}",
            'message' => "Ada tagihan sebesar {$formatCurrency}. Yuk dicek dan segera dibayar ya!",
            'url' => route('dashboard.transaction.show', $this->idTrx),
        ];
    }
}
