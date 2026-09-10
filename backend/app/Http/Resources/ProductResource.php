<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => (float) $this->price,
            'sale_price' => $this->sale_price !== null ? (float) $this->sale_price : null,
            'current_price' => (float) ($this->sale_price ?? $this->price),
            'on_sale' => $this->sale_price !== null && (float) $this->sale_price < (float) $this->price,
            'sku' => $this->sku,
            'size_ml' => $this->size_ml,
            'gender' => $this->gender,
            'stock' => $this->stock,
            'in_stock' => $this->stock > 0,
            'image_url' => $this->image_url,
            'is_featured' => (bool) $this->is_featured,
            'rating' => (float) $this->rating,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'brand' => $this->whenLoaded('brand', fn () => [
                'id' => $this->brand?->id,
                'name' => $this->brand?->name,
                'slug' => $this->brand?->slug,
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
