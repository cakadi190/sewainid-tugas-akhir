<?php

namespace App\Http\Controllers\Web\Admin;

use App\Enums\RentalStatusEnum;
use App\Enums\RoleUser;
use App\Enums\TransactionStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\CarData;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * Sets the SEO title for the page and returns
     * the Inertia response for the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        seo()->title('Beranda Admin')->generate();

        $carsTotal = CarData::count();
        $rentActive = Transaction::where('rental_status', RentalStatusEnum::IN_PROGRESS)->count();
        $users = User::where('role', RoleUser::USER)->count();
        $ratingAvg = Review::avg('rating');

        // Revenue Overview Data
        $revenueOverview = $this->getRevenueOverview();

        $recentTransactions = Transaction::latest()
            ->with([
                'carData' => fn ($query) => $query->select(['id', 'brand', 'car_name']),
                'user'
            ])
            ->take(5)->get();

        return inertia('Admin/Dashboard', [
            'summary' => [
                'carsTotal' => $carsTotal,
                'rentActive' => $rentActive,
                'users' => $users,
                'ratingAvg' => $ratingAvg
            ],
            'revenueOverview' => $revenueOverview,
            'recentTransactions' => fn() => $recentTransactions
        ]);
    }

    /**
     * Get revenue overview data for charts
     *
     * @return array
     */
    private function getRevenueOverview(): array
    {
        // Monthly revenue for the last 12 months
        $monthlyRevenue = Transaction::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_pay) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create($item->year, $item->month)->format('M Y'),
                    'revenue' => (int) $item->revenue,
                    'transactions' => (int) $item->transactions,
                ];
            });

        // Fill missing months with zero values
        $monthlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthKey = $date->format('M Y');

            $existingData = $monthlyRevenue->firstWhere('month', $monthKey);

            $monthlyData[] = [
                'month' => $monthKey,
                'revenue' => $existingData ? $existingData['revenue'] : 0,
                'transactions' => $existingData ? $existingData['transactions'] : 0,
            ];
        }

        // Current month statistics
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthRevenue = Transaction::where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', $currentMonthStart)
            ->sum('total_pay');

        $previousMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        $previousMonthRevenue = Transaction::where('status', TransactionStatusEnum::PAID)
            ->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])
            ->sum('total_pay');

        // Calculate growth percentage
        $growthPercentage = $previousMonthRevenue > 0
            ? (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 0;

        // Top performing cars
        $topCars = Transaction::select(
                'car_data_id',
                DB::raw('SUM(total_pay) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->with(['carData:id,car_name,brand'])
            ->where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', Carbon::now()->subMonths(3))
            ->groupBy('car_data_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->carData->brand . ' ' . $item->carData->car_name,
                    'revenue' => (int) $item->revenue,
                    'bookings' => (int) $item->bookings,
                ];
            });

        return [
            'monthlyData' => $monthlyData,
            'currentMonthRevenue' => (int) $currentMonthRevenue,
            'previousMonthRevenue' => (int) $previousMonthRevenue,
            'growthPercentage' => round($growthPercentage, 2),
            'topCars' => $topCars,
            'totalRevenue' => Transaction::where('status', TransactionStatusEnum::PAID)->sum('total_pay'),
        ];
    }
}
