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
    private const MONTHS_RANGE = 12;
    private const TOP_CARS_LIMIT = 5;
    private const RECENT_TRANSACTIONS_LIMIT = 5;

    public function __invoke(Request $request)
    {
        seo()->title('Beranda Admin')->generate();

        $summary = $this->getSummaryData();
        $revenueOverview = $this->getRevenueOverview();
        $recentTransactions = $this->getRecentTransactions();

        return inertia('Admin/Dashboard', [
            'summary' => $summary,
            'revenueOverview' => $revenueOverview,
            'recentTransactions' => fn() => $recentTransactions
        ]);
    }

    private function getSummaryData(): array
    {
        $carsTotal = CarData::count();
        $rentActive = Transaction::where('rental_status', RentalStatusEnum::IN_PROGRESS)->count();
        $users = User::where('role', RoleUser::USER)->count();
        $ratingAvg = Review::avg('rating');

        return [
            'carsTotal' => $carsTotal,
            'rentActive' => $rentActive,
            'users' => $users,
            'ratingAvg' => $ratingAvg
        ];
    }

    private function getRevenueOverview(): array
    {
        $monthlyData = $this->getMonthlyRevenueData();
        $monthlyMetrics = $this->getMonthlyMetrics();
        $topCars = $this->getTopCars();
        $totalRevenue = $this->getTotalRevenue();

        return [
            'monthlyData' => $monthlyData,
            'currentMonthRevenue' => $monthlyMetrics['current'],
            'previousMonthRevenue' => $monthlyMetrics['previous'],
            'growthPercentage' => $monthlyMetrics['growth'],
            'topCars' => $topCars,
            'totalRevenue' => $totalRevenue,
        ];
    }

    private function getMonthlyRevenueData(): array
    {
        $startDate = Carbon::now()->subMonths(self::MONTHS_RANGE);

        $monthlyRevenue = Transaction::select([
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_pay) as revenue'),
                DB::raw('COUNT(*) as transactions')
            ])
            ->where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', $startDate)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->keyBy(function ($item) {
                return Carbon::create($item->year, $item->month)->format('M Y');
            });

        $monthlyData = [];
        for ($i = self::MONTHS_RANGE - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthKey = $date->format('M Y');

            $existingData = $monthlyRevenue->get($monthKey);

            $monthlyData[] = [
                'month' => $monthKey,
                'revenue' => $existingData ? (int) $existingData->revenue : 0,
                'transactions' => $existingData ? (int) $existingData->transactions : 0,
            ];
        }

        return $monthlyData;
    }

    private function getMonthlyMetrics(): array
    {
        $now = Carbon::now();

        $currentMonthRevenue = Transaction::where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', $now->copy()->startOfMonth())
            ->sum('total_pay');

        $previousMonthRevenue = Transaction::where('status', TransactionStatusEnum::PAID)
            ->whereBetween('created_at', [
                $now->copy()->subMonth()->startOfMonth(),
                $now->copy()->subMonth()->endOfMonth()
            ])
            ->sum('total_pay');

        $growthPercentage = $previousMonthRevenue > 0
            ? round((($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 2)
            : 0;

        return [
            'current' => (int) $currentMonthRevenue,
            'previous' => (int) $previousMonthRevenue,
            'growth' => $growthPercentage,
        ];
    }

    private function getTopCars(): array
    {
        return Transaction::select([
                'car_data_id',
                DB::raw('SUM(total_pay) as revenue'),
                DB::raw('COUNT(*) as bookings')
            ])
            ->with(['carData:id,car_name,brand'])
            ->where('status', TransactionStatusEnum::PAID)
            ->where('created_at', '>=', Carbon::now()->subMonths(3))
            ->groupBy('car_data_id')
            ->orderByDesc('revenue')
            ->limit(self::TOP_CARS_LIMIT)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->carData->brand . ' ' . $item->carData->car_name,
                    'revenue' => (int) $item->revenue,
                    'bookings' => (int) $item->bookings,
                ];
            })
            ->toArray();
    }

    private function getTotalRevenue(): int
    {
        return (int) Transaction::where('status', TransactionStatusEnum::PAID)
            ->sum('total_pay');
    }

    private function getRecentTransactions()
    {
        return Transaction::latest()
            ->with([
                'carData' => fn ($query) => $query->select(['id', 'brand', 'car_name']),
                'user'
            ])
            ->take(self::RECENT_TRANSACTIONS_LIMIT)
            ->get();
    }
}
