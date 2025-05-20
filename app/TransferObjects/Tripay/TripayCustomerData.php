<?php

namespace App\TransferObjects\Tripay;

/**
 * TripayCustomerData class
 *
 * This class is used to store customer data for Tripay transactions.
 * The properties are read-only and must be set at instantiation.
 *
 * @package App\TransferObjects\Tripay
 */
final class TripayCustomerData
{
    /**
     * Create a new class instance.
     *
     * @param string $name  The name of the customer.
     * @param string $email The email address of the customer.
     * @param string $phone The phone number of the customer.
     */
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $phone,
    ) {
    }
}

