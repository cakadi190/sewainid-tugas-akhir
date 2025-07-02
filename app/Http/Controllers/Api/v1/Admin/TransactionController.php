<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Notifications\TransactionReminderNotification;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class TransactionController extends Controller
{
    /**
     * Send a reminder notification to the user associated with the transaction.
     *
     * This function attempts to notify the user of a given transaction by sending
     * a TransactionReminderNotification. In case of an error, a log entry is created
     * and the user is redirected back with an error message.
     *
     * @param  Transaction  $transaction  The transaction for which the reminder is to be sent.
     * @return \Illuminate\Http\RedirectResponse A redirect response back to the previous page.
     */
    public function sendReminder(Transaction $transaction)
    {
        try {
            $user = $transaction->user;
            Notification::sendNow($user, new TransactionReminderNotification($transaction));

            return back();
        } catch (Exception $e) {
            Log::error($e);

            return back()->with('error', 'Terjadi kesalahan saat mengirimkan reminder');
        }
    }
}
