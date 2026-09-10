<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = request()->user()
            ->orders()
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== request()->user()->id, 403, 'Forbidden.');

        return new OrderResource($order->load('items'));
    }

    public function store(StoreOrderRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $order = DB::transaction(function () use ($validated, $user) {
            $productIds = collect($validated['items'])->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->where('is_active', true)->get()->keyBy('id');

            $subtotal = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);

                abort_if(! $product, 422, "Product {$item['product_id']} is not available.");
                abort_if($product->stock < $item['quantity'], 422, "Not enough stock for {$product->name}.");

                $unitPrice = (float) ($product->sale_price ?? $product->price);
                $lineTotal = $unitPrice * $item['quantity'];
                $subtotal += $lineTotal;

                $lineItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_image' => $product->image_url,
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            $shippingFee = $subtotal >= 100 ? 0 : 5;

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'status' => 'pending',
                'payment_method' => 'cod',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $subtotal + $shippingFee,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'] ?? $user->email,
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_state' => $validated['shipping_state'] ?? null,
                'shipping_postal_code' => $validated['shipping_postal_code'] ?? null,
                'shipping_country' => $validated['shipping_country'] ?? 'Pakistan',
                'notes' => $validated['notes'] ?? null,
            ]);

            $order->items()->createMany($lineItems);

            foreach ($validated['items'] as $item) {
                $products->get($item['product_id'])->decrement('stock', $item['quantity']);
            }

            return $order;
        });

        return new OrderResource($order->load('items'));
    }
}
