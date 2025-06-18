<?php

namespace App\Http\Controllers\Api\v1\Global;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Handle the incoming request to fetch unread notifications.
     *
     * Retrieves the unread notifications of the authenticated user.
     */
    public function index()
    {
        return Auth::user()->unreadNotifications()->paginate(20);
    }

    /**
     * Handle the incoming request to mark all notifications as read.
     *
     * Updates all unread notifications of the authenticated user as read.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function readAll()
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);
        return back();
    }

    /**
     * Handle the incoming request to redirect to the notification referer.
     *
     * Marks the specified notification as read, then redirects to the referer URL.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function referTo(Request $request)
    {
        Auth::user()->notifications()->find($request->id)->markAsRead();

        return redirect()->to($request->url);
    }
}
