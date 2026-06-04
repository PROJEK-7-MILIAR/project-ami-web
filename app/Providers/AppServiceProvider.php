<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_ENV') !== 'local' || request()->header('x-forwarded-proto') === 'https') {
            URL::forceScheme('https');
        }

        Event::listen(function (Login $event) {
            ActivityLog::create([
                'admin' => $event->user->name ?? $event->user->username,
                'type' => 'login',
                'description' => 'User berhasil login ke dalam sistem.'
            ]);
        });

        Event::listen(function (Logout $event) {
            if ($event->user) {
                ActivityLog::create([
                    'admin' => $event->user->name ?? $event->user->username,
                    'type' => 'logout',
                    'description' => 'User melakukan logout dari sistem.'
                ]);
            }
        });
    }
}
