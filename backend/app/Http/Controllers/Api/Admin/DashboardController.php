<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'stats' => [
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'total_revenue' => (float) Order::whereIn('status', ['processing', 'shipped', 'delivered'])->sum('total'),
                'low_stock_products' => Product::where('stock', '<=', 5)->count(),
            ],
            'recent_orders' => OrderResource::collection(
                Order::with(['items', 'user'])->orderByDesc('created_at')->limit(5)->get()
            ),
        ]);
    }
}
