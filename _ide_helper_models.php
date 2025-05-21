<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * Assign Driver Model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $transaction_id
 * @property int $user_id
 * @property-read Transaction $transaction
 * @property-read User $user
 * @method static \Database\Factories\AssignDriverFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AssignDriver whereUserId($value)
 * @mixin \Eloquent
 */
	class AssignDriver extends \Eloquent {}
}

namespace App\Models{
/**
 * Car Data model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $car_name
 * @property string $brand Misal: Toyota, Suzuki, Honda, Mercy
 * @property string|null $slug
 * @property string $frame_number
 * @property string $engine_number
 * @property string $license_plate
 * @property string $license_plate_expiration
 * @property string|null $vehicle_registration_cert_number
 * @property string|null $vehicle_ownership_book_number
 * @property string $vehicle_registration_cert_expiration
 * @property string $color
 * @property int $year_of_manufacture
 * @property CarTransmissionEnum $transmission
 * @property CarModelEnum $model
 * @property CarStatusEnum $status
 * @property FuelTypeEnum $fuel_type
 * @property CarConditionEnum $condition
 * @property string|null $description
 * @property int $doors
 * @property int $seats
 * @property int $max_speed
 * @property int $big_luggage
 * @property int $med_luggage
 * @property int $small_luggage
 * @property int $mileage
 * @property int $ac
 * @property int $audio
 * @property int $abs
 * @property int $child_lock
 * @property int $traction_control
 * @property int $baby_seat
 * @property int $rent_price
 * @property string|null $gps_imei
 * @property-read mixed $full_name
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $review
 * @property-read int|null $review_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transaction
 * @property-read int|null $transaction_count
 * @method static \Database\Factories\CarDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereAudio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBabySeat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBigLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCarName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereChildLock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereDoors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereEngineNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFrameNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereFuelType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereGpsImei($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereLicensePlateExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMedLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereRentPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSeats($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereSmallLuggage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTractionControl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereTransmission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleOwnershipBookNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertExpiration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereVehicleRegistrationCertNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarData whereYearOfManufacture($value)
 * @mixin \Eloquent
 */
	class CarData extends \Eloquent implements \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models{
/**
 * Maintenance Record Model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $repair_date
 * @property string $description
 * @property int|null $last_mileage
 * @property int|null $current_mileage
 * @property string|null $cost
 * @property string $status
 * @property string|null $notes
 * @property int|null $car_data_id
 * @property-read \App\Models\CarData|null $carData
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @method static \Database\Factories\CarRepairNoteDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereCurrentMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereLastMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereRepairDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CarRepairNoteData whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	class CarRepairNoteData extends \Eloquent implements \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property int $rating Rating antara angka 1 s/d 10
 * @property string|null $description
 * @method static \Database\Factories\ReviewFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUserId($value)
 * @mixin \Eloquent
 */
	class Review extends \Eloquent {}
}

namespace App\Models{
/**
 * Transaction Model
 *
 * @property string $id
 * @property string $status
 * @property string $rental_status
 * @property string|null $confirmed_at
 * @property string|null $payment_channel
 * @property string|null $payment_references
 * @property string|null $expired_at
 * @property int $total_price
 * @property int $total_pay
 * @property string|null $pickup_date
 * @property string|null $return_date
 * @property string $place_name
 * @property int $with_driver
 * @property string $longitude
 * @property string $latitude
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property-read \App\Models\CarData|null $carData
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereExpiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePaymentChannel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePaymentReferences($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePickupDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePlaceName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereRentalStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereReturnDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTotalPay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTotalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereWithDriver($value)
 * @mixin \Eloquent
 * @property-read \App\Models\User|null $user
 */
	class Transaction extends \Eloquent {}
}

namespace App\Models{
/**
 * Transaction Confirmation Model
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $transaction_receipt
 * @property string $transaction_id
 * @property int|null $user_id
 * @method static \Database\Factories\TransactionConfirmationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereTransactionReceipt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionConfirmation whereUserId($value)
 * @mixin \Eloquent
 */
	class TransactionConfirmation extends \Eloquent {}
}

namespace App\Models{
/**
 * Note Data after Rental
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property int|null $mileage
 * @property UsageNoteTypeEnum $type
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property string|null $transaction_id
 * @method static \Database\Factories\UsageNoteDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UsageNoteData whereUserId($value)
 * @mixin \Eloquent
 */
	class UsageNoteData extends \Eloquent {}
}

namespace App\Models{
/**
 * User Class model
 *
 * @property int $id
 * @property string $name
 * @property GenderUser|null $gender
 * @property RoleUser|null $role
 * @property string|null $pbirth
 * @property string|null $dbirth
 * @property string $email
 * @property string|null $phone
 * @property string|null $address
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $password
 * @property string $avatar
 * @property string|null $nik Encrypted Data
 * @property string|null $kk Encrypted Data
 * @property string|null $sim Encrypted Data
 * @property string|null $google_id
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * @property-read int|null $transactions_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDbirth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereKk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereNik($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePbirth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSim($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Wishlist> $wishlists
 * @property-read int|null $wishlists_count
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

namespace App\Models{
/**
 * Wishlist Model Data
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $car_data_id
 * @property-read \App\Models\CarData|null $carData
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\WishlistFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereCarDataId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereUserId($value)
 * @mixin \Eloquent
 */
	class Wishlist extends \Eloquent {}
}

