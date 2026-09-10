<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin & demo customer accounts
        User::create([
            'name' => 'Store Admin',
            'email' => 'admin@perfumestore.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Demo Customer',
            'email' => 'customer@perfumestore.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Categories
        $categories = collect([
            'Eau de Parfum',
            'Eau de Toilette',
            'Oud & Attar',
            'Gift Sets',
        ])->mapWithKeys(fn ($name) => [$name => Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => "Explore our {$name} collection.",
        ])]);

        // Brands
        $brands = collect([
            'Chanel', 'Dior', 'Tom Ford', 'Versace', 'Yves Saint Laurent', 'Armani', 'Gucci', 'Jo Malone London',
        ])->mapWithKeys(fn ($name) => [$name => Brand::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => "Signature fragrances from {$name}.",
            'logo_url' => 'https://placehold.co/200x80?text='.urlencode($name),
        ])]);

        // Products
        $products = [
            ['name' => 'Noir Elegance EDP', 'brand' => 'Chanel', 'category' => 'Eau de Parfum', 'price' => 145, 'sale_price' => 129, 'gender' => 'women', 'size_ml' => 100, 'featured' => true, 'rating' => 4.8],
            ['name' => 'Midnight Oud', 'brand' => 'Tom Ford', 'category' => 'Oud & Attar', 'price' => 210, 'sale_price' => null, 'gender' => 'unisex', 'size_ml' => 50, 'featured' => true, 'rating' => 4.9],
            ['name' => 'Sauvage Intense', 'brand' => 'Dior', 'category' => 'Eau de Toilette', 'price' => 120, 'sale_price' => 99, 'gender' => 'men', 'size_ml' => 100, 'featured' => true, 'rating' => 4.7],
            ['name' => 'Eros Vibrant', 'brand' => 'Versace', 'category' => 'Eau de Toilette', 'price' => 95, 'sale_price' => null, 'gender' => 'men', 'size_ml' => 100, 'featured' => false, 'rating' => 4.5],
            ['name' => 'Libre Bloom', 'brand' => 'Yves Saint Laurent', 'category' => 'Eau de Parfum', 'price' => 135, 'sale_price' => null, 'gender' => 'women', 'size_ml' => 90, 'featured' => true, 'rating' => 4.6],
            ['name' => 'Si Passione', 'brand' => 'Armani', 'category' => 'Eau de Parfum', 'price' => 110, 'sale_price' => 89, 'gender' => 'women', 'size_ml' => 100, 'featured' => false, 'rating' => 4.4],
            ['name' => 'Bloom Blossom', 'brand' => 'Gucci', 'category' => 'Eau de Toilette', 'price' => 105, 'sale_price' => null, 'gender' => 'women', 'size_ml' => 100, 'featured' => false, 'rating' => 4.3],
            ['name' => 'Wood Sage & Sea Salt', 'brand' => 'Jo Malone London', 'category' => 'Eau de Toilette', 'price' => 98, 'sale_price' => null, 'gender' => 'unisex', 'size_ml' => 100, 'featured' => true, 'rating' => 4.6],
            ['name' => 'Royal Amber Attar', 'brand' => 'Tom Ford', 'category' => 'Oud & Attar', 'price' => 250, 'sale_price' => 220, 'gender' => 'unisex', 'size_ml' => 30, 'featured' => false, 'rating' => 4.9],
            ['name' => 'Homme Sport', 'brand' => 'Dior', 'category' => 'Eau de Toilette', 'price' => 88, 'sale_price' => null, 'gender' => 'men', 'size_ml' => 100, 'featured' => false, 'rating' => 4.2],
            ['name' => 'Coco Mademoiselle', 'brand' => 'Chanel', 'category' => 'Eau de Parfum', 'price' => 155, 'sale_price' => null, 'gender' => 'women', 'size_ml' => 100, 'featured' => true, 'rating' => 4.9],
            ['name' => 'Aventus Elite', 'brand' => 'Tom Ford', 'category' => 'Eau de Parfum', 'price' => 230, 'sale_price' => 199, 'gender' => 'men', 'size_ml' => 100, 'featured' => true, 'rating' => 4.9],
            ['name' => 'Allure Homme', 'brand' => 'Chanel', 'category' => 'Eau de Toilette', 'price' => 115, 'sale_price' => null, 'gender' => 'men', 'size_ml' => 100, 'featured' => false, 'rating' => 4.5],
            ['name' => 'Gift Duo Set', 'brand' => 'Versace', 'category' => 'Gift Sets', 'price' => 180, 'sale_price' => 150, 'gender' => 'unisex', 'size_ml' => 100, 'featured' => true, 'rating' => 4.7],
            ['name' => 'Rose Attar Royale', 'brand' => 'Jo Malone London', 'category' => 'Oud & Attar', 'price' => 175, 'sale_price' => null, 'gender' => 'women', 'size_ml' => 30, 'featured' => false, 'rating' => 4.6],
            ['name' => 'Couples Fragrance Set', 'brand' => 'Gucci', 'category' => 'Gift Sets', 'price' => 220, 'sale_price' => 189, 'gender' => 'unisex', 'size_ml' => 150, 'featured' => false, 'rating' => 4.5],
        ];

        foreach ($products as $p) {
            $slug = Str::slug($p['name']).'-'.Str::lower(Str::random(4));

            Product::create([
                'category_id' => $categories[$p['category']]->id,
                'brand_id' => $brands[$p['brand']]->id,
                'name' => $p['name'],
                'slug' => $slug,
                'description' => "The {$p['name']} by {$p['brand']} is a captivating fragrance blending rich top notes with a warm, lasting base — perfect for those who want to leave a lasting impression.",
                'short_description' => "A signature scent from {$p['brand']}.",
                'price' => $p['price'],
                'sale_price' => $p['sale_price'],
                'sku' => 'SKU-'.strtoupper(Str::random(8)),
                'size_ml' => $p['size_ml'],
                'gender' => $p['gender'],
                'stock' => rand(5, 60),
                'image_url' => 'https://placehold.co/600x800/1a1a1a/d4af37?text='.urlencode($p['name']),
                'is_featured' => $p['featured'],
                'is_active' => true,
                'rating' => $p['rating'],
            ]);
        }
    }
}
