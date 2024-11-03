<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Class ClassLoaderProvider
 *
 * This service provider is responsible for binding interface contracts
 * with their corresponding implementation classes. This allows for
 * dependency injection to work seamlessly across the application,
 * where the interfaces can be injected into classes, and the container
 * will resolve them to their respective implementations.
 *
 * @package App\Providers
 */
class ClassLoaderProvider extends ServiceProvider
{
    /**
     * Load files from a specified directory.
     *
     * This method searches for PHP files in the given directory path and includes them if they exist.
     * It uses glob to find files and requires_once to load them, ensuring each file is loaded only once.
     *
     * @param string $path The relative path within the app directory to search for files
     * @return void
     */
    private function fileLoader(string $path): void
    {
        $files = glob(app_path($path));

        if ($files === false) return;

        foreach ($files as $file) {
            if (file_exists($file)) {
                require_once $file;
            }
        }
    }

    /**
     * List of class bindings.
     *
     * This array holds a list of interface-to-implementation mappings
     * that will be registered within the service container. Each key
     * in this array is an interface, and each value is the concrete
     * class that implements it.
     *
     * @var array<string, string> The class bindings for interfaces and implementations.
     */
    protected array $_classes = [
        \App\Interfaces\LicensePlateNumberGenerator::class  => \App\Helpers\LicensePlateNumberGenerator::class,
        \App\Interfaces\CrudHelper::class                   => \App\Helpers\CrudHelper::class,
        \App\Interfaces\SecurityHelper::class               => \App\Helpers\SecurityHelper::class,
        \App\Interfaces\SelectHelper::class                 => \App\Helpers\SelectHelper::class,
    ];

    /**
     * Register services.
     *
     * This method is responsible for registering the interface-to-implementation
     * bindings with the service container. It utilizes Laravel's `bind` method,
     * which registers the given interface to its respective implementation.
     *
     * @return void
     */
    public function register(): void
    {
        # Load All Files Inside `FunctionHelpers`
        $this->fileLoader('/FunctionHelpers/*.php');

        # Autoload Class
        collect($this->_classes)
            ->each(
                fn($implementation, $interface) =>
                $this->app->bind($interface, $implementation)
            );
    }

    /**
     * Bootstrap services.
     *
     * This method is intended for performing actions after all services have
     * been registered. Currently, it is empty but can be used to execute any
     * code needed when the application bootstraps.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }
}
