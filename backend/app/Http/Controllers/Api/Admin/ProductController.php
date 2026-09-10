<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'brand'])
            ->orderByDesc('created_at')
            ->paginate(15);

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']).'-'.Str::random(5);

        $product = Product::create($data);

        return new ProductResource($product->load(['category', 'brand']));
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'brand']));
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $data = $request->validated();

        if (! empty($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']).'-'.Str::random(5);
        }

        $product->update($data);

        return new ProductResource($product->load(['category', 'brand']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
