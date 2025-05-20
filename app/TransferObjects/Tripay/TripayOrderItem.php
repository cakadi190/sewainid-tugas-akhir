<?php

namespace App\TransferObjects\Tripay;

/**
 * Class TripayOrderItem
 *
 * @package App\TransferObjects\Tripay
 * @property-read string $sku
 * @property-read string $name
 * @property-read int $price
 * @property-read int $quantity
 * @property-read string|null $product_url
 * @property-read string|null $image_url
 */
final class TripayOrderItem
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        public readonly string $name,
        public readonly int $price,
        public readonly int $quantity,
        public readonly ?string $sku = null,
        public readonly ?string $product_url = null,
        public readonly ?string $image_url = null
    ) {
    }
}

