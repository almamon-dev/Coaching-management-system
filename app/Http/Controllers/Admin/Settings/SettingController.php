<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;
use App\Support\Media\FileUploader;
use App\Support\Media\FileRemover;

class SettingController extends Controller
{
    /**
     * Website System Settings
     */
    public function websiteSystem()
    {
        $keys = [
            'site_name',
            'site_tagline',
            'site_url',
            'title_prefix',
            'meta_description',
            'keywords',
            'timezone',
            'maintenance_mode',
            'force_ssl',
            'debug_mode',
            'site_logo',
            'site_favicon'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        
        $settings = [
            'site_name' => $dbSettings['site_name'] ?? config('app.name'),
            'site_tagline' => $dbSettings['site_tagline'] ?? 'Your Brand Tagline',
            'site_url' => $dbSettings['site_url'] ?? config('app.url'),
            'title_prefix' => $dbSettings['title_prefix'] ?? '',
            'meta_description' => $dbSettings['meta_description'] ?? '',
            'keywords' => $dbSettings['keywords'] ?? '',
            'timezone' => $dbSettings['timezone'] ?? config('app.timezone'),
            'maintenance_mode' => isset($dbSettings['maintenance_mode']) ? filter_var($dbSettings['maintenance_mode'], FILTER_VALIDATE_BOOLEAN) : false,
            'force_ssl' => isset($dbSettings['force_ssl']) ? filter_var($dbSettings['force_ssl'], FILTER_VALIDATE_BOOLEAN) : true,
            'debug_mode' => isset($dbSettings['debug_mode']) ? filter_var($dbSettings['debug_mode'], FILTER_VALIDATE_BOOLEAN) : config('app.debug'),
            'site_logo' => $dbSettings['site_logo'] ?? null,
            'site_favicon' => $dbSettings['site_favicon'] ?? null,
        ];

        return Inertia::render('Admin/Settings/Website/SystemPage', [
            'settings' => $settings,
            'timezones' => \DateTimeZone::listIdentifiers()
        ]);
    }

    /**
     * Financial Gateway Settings
     */
    public function financialGateway()
    {
        $keys = [
            'stripe_mode',
            'stripe_key',
            'stripe_secret',
            'stripe_webhook_secret',
            'fund_hold_minutes'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'stripe_mode' => $dbSettings['stripe_mode'] ?? 'test',
            'stripe_key' => $dbSettings['stripe_key'] ?? config('services.stripe.key'),
            'stripe_secret' => $dbSettings['stripe_secret'] ?? config('services.stripe.secret'),
            'stripe_webhook_secret' => $dbSettings['stripe_webhook_secret'] ?? config('services.stripe.webhook_secret'),
            'fund_hold_minutes' => $dbSettings['fund_hold_minutes'] ?? env('FUND_HOLD_MINUTES', 5),
        ];

        return Inertia::render('Admin/Settings/Financial/GatewayPage', [
            'settings' => $settings
        ]);
    }

    /**
     * Company Settings
     */
    public function companySettings()
    {
        $keys = [
            'company_name',
            'legal_name',
            'established_since',
            'company_email',
            'company_phone',
            'registration_no',
            'tax_id',
            'website',
            'address',
            'is_operating_active',
            'business_hours'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'company_name' => $dbSettings['company_name'] ?? 'Almamon Softwares Ltd.',
            'legal_name' => $dbSettings['legal_name'] ?? 'Almamon Tech Solutions Inc.',
            'established_since' => $dbSettings['established_since'] ?? '2020-01-01',
            'company_email' => $dbSettings['company_email'] ?? 'hello@almamon.dev',
            'company_phone' => $dbSettings['company_phone'] ?? '+880 1234 567 890',
            'registration_no' => $dbSettings['registration_no'] ?? 'REG-2026-X990',
            'tax_id' => $dbSettings['tax_id'] ?? 'TAX-8822-001',
            'website' => $dbSettings['website'] ?? 'https://almamon.dev',
            'address' => $dbSettings['address'] ?? '123 Tech Square, Digital City, Dhaka, Bangladesh',
            'is_operating_active' => isset($dbSettings['is_operating_active']) ? filter_var($dbSettings['is_operating_active'], FILTER_VALIDATE_BOOLEAN) : true,
            'business_hours' => isset($dbSettings['business_hours']) ? json_decode($dbSettings['business_hours'], true) : [
                ['from_day' => 'Saturday', 'to_day' => 'Thursday', 'start_time' => '09:00 AM', 'end_time' => '06:00 PM', 'status' => 'Open'],
                ['from_day' => 'Friday', 'to_day' => 'Friday', 'start_time' => '-', 'end_time' => '-', 'status' => 'Closed']
            ],
        ];

        return Inertia::render('Admin/Settings/Website/CompanyPage', [
            'settings' => $settings
        ]);
    }

    /**
     * Email Settings
     */
    public function emailSettings()
    {
        $settings = [
            'mail_mailer' => env('MAIL_MAILER', 'smtp'),
            'mail_host' => env('MAIL_HOST', '127.0.0.1'),
            'mail_port' => env('MAIL_PORT', 587),
            'mail_username' => env('MAIL_USERNAME', ''),
            'mail_password' => env('MAIL_PASSWORD', ''),
            'mail_encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'mail_from_address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
            'mail_from_name' => env('MAIL_FROM_NAME', 'Example'),
        ];

        return Inertia::render('Admin/Settings/System/EmailPage', [
            'settings' => $settings
        ]);
    }

    /**
     * Appearance Settings
     */
    public function appearanceSettings()
    {
        $keys = [
            'primary_color',
            'secondary_color',
            'theme_mode',
            'layout_density',
            'border_radius',
            'font_family'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'primary_color' => $dbSettings['primary_color'] ?? '#008060',
            'secondary_color' => $dbSettings['secondary_color'] ?? '#1a1c1d',
            'theme_mode' => $dbSettings['theme_mode'] ?? 'system',
            'layout_density' => $dbSettings['layout_density'] ?? 'compact',
            'border_radius' => $dbSettings['border_radius'] ?? '4px',
            'font_family' => $dbSettings['font_family'] ?? 'Inter',
        ];

        return Inertia::render('Admin/Settings/Website/AppearancePage', [
            'settings' => $settings
        ]);
    }

    /**
     * Localization Settings
     */
    public function localizationSettings()
    {
        $keys = [
            'timezone',
            'default_language',
            'date_format',
            'time_format',
            'currency',
            'currency_position',
            'thousand_separator',
            'decimal_separator'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'timezone' => $dbSettings['timezone'] ?? '(UTC+06:00) Astana, Dhaka',
            'default_language' => $dbSettings['default_language'] ?? 'English (US)',
            'date_format' => $dbSettings['date_format'] ?? 'DD/MM/YYYY',
            'time_format' => $dbSettings['time_format'] ?? '12-hour',
            'currency' => $dbSettings['currency'] ?? 'EUR (€)',
            'currency_position' => $dbSettings['currency_position'] ?? 'Left',
            'thousand_separator' => $dbSettings['thousand_separator'] ?? ',',
            'decimal_separator' => $dbSettings['decimal_separator'] ?? '.',
        ];

        return Inertia::render('Admin/Settings/Website/LocalizationPage', [
            'settings' => $settings
        ]);
    }

    public function updateLocalizationSettings(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return redirect()->back()->with('success', 'Localization settings updated successfully.');
    }

    /**
     * System Prefixes Settings
     */
    public function prefixesSettings()
    {
        $keys = [
            'order_prefix',
            'invoice_prefix',
            'transaction_prefix',
            'product_sku_prefix',
            'customer_prefix'
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'order_prefix' => $dbSettings['order_prefix'] ?? 'ORD-',
            'invoice_prefix' => $dbSettings['invoice_prefix'] ?? 'INV-',
            'transaction_prefix' => $dbSettings['transaction_prefix'] ?? 'TXN-',
            'product_sku_prefix' => $dbSettings['product_sku_prefix'] ?? 'SKU-',
            'customer_prefix' => $dbSettings['customer_prefix'] ?? 'CUS-',
        ];

        return Inertia::render('Admin/Settings/Website/PrefixesPage', [
            'settings' => $settings
        ]);
    }

    /**
     * Update Email settings in .env
     */
    public function updateEmail(Request $request)
    {
        $data = $request->except(['_token', '_method']);
        
        // Map frontend keys to .env keys
        $envData = [
            'MAIL_MAILER' => $data['mail_mailer'] ?? 'smtp',
            'MAIL_HOST' => $data['mail_host'] ?? '',
            'MAIL_PORT' => $data['mail_port'] ?? '',
            'MAIL_USERNAME' => $data['mail_username'] ?? '',
            'MAIL_PASSWORD' => $data['mail_password'] ?? '',
            'MAIL_ENCRYPTION' => $data['mail_encryption'] ?? '',
            'MAIL_FROM_ADDRESS' => $data['mail_from_address'] ?? '',
            'MAIL_FROM_NAME' => $data['mail_from_name'] ?? '',
        ];

        $this->updateEnv($envData);

        return redirect()->back()->with('success', 'Email settings updated in .env successfully.');
    }

    /**
     * Private helper to update .env file
     */
    private function updateEnv(array $data)
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $content = file_get_contents($path);

            foreach ($data as $key => $value) {
                $value = (string) $value;
                // If value has spaces or special chars, wrap in quotes
                $safeValue = (strpos($value, ' ') !== false || strpos($value, '€') !== false) ? "\"$value\"" : $value;
                
                if (preg_match("/^{$key}=/m", $content)) {
                    $content = preg_replace("/^{$key}=.*/m", "{$key}={$safeValue}", $content);
                } else {
                    $content .= "\n{$key}={$safeValue}";
                }
            }

            file_put_contents($path, $content);
        }
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $settings = $request->except(['_token', '_method']);
        
        // Handle File Uploads
        if ($request->hasFile('site_logo')) {
            $path = FileUploader::upload('settings', $request->file('site_logo'));
            $settings['site_logo'] = \App\Support\Media\FileUrlGenerator::generate($path);
        }

        if ($request->hasFile('site_favicon')) {
            $path = FileUploader::upload('settings', $request->file('site_favicon'));
            $settings['site_favicon'] = \App\Support\Media\FileUrlGenerator::generate($path);
        }

        // Keys that should also be updated in .env
        $envKeysMapping = [
            'stripe_key' => 'STRIPE_KEY',
            'stripe_secret' => 'STRIPE_SECRET',
            'stripe_webhook_secret' => 'STRIPE_WEBHOOK_SECRET',
            'fund_hold_minutes' => 'FUND_HOLD_MINUTES',
        ];

        $envUpdateData = [];

        foreach ($settings as $key => $value) {
            // Skip files that are not handled above or empty strings if they are files
            if ($value instanceof \Illuminate\Http\UploadedFile) {
                continue;
            }

            if (is_array($value)) {
                $finalValue = json_encode($value);
            } else {
                $finalValue = is_bool($value) ? ($value ? 'true' : 'false') : $value;
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $finalValue]
            );

            // Collect data for .env update if matches mapping
            if (isset($envKeysMapping[$key])) {
                $envUpdateData[$envKeysMapping[$key]] = $finalValue;
            }
        }

        // Batch update .env if needed
        if (!empty($envUpdateData)) {
            $this->updateEnv($envUpdateData);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Storage Settings (Local / Cloudflare R2)
     */
    public function storageSettings()
    {
        $keys = [
            'storage_driver',
            'r2_account_id',
            'r2_access_key_id',
            'r2_secret_access_key',
            'r2_bucket',
            'r2_url',
        ];

        $dbSettings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        $settings = [
            'storage_driver'      => $dbSettings['storage_driver'] ?? 'local',
            'r2_account_id'       => $dbSettings['r2_account_id'] ?? '',
            'r2_access_key_id'    => $dbSettings['r2_access_key_id'] ?? '',
            'r2_secret_access_key'=> $dbSettings['r2_secret_access_key'] ?? '',
            'r2_bucket'           => $dbSettings['r2_bucket'] ?? '',
            'r2_url'              => $dbSettings['r2_url'] ?? '',
        ];

        return Inertia::render('Admin/Settings/System/StoragePage', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update Storage settings — saves to DB and syncs .env
     */
    public function updateStorage(Request $request)
    {
        $request->validate([
            'storage_driver'       => 'required|in:local,r2',
            'r2_account_id'        => 'nullable|string',
            'r2_access_key_id'     => 'nullable|string',
            'r2_secret_access_key' => 'nullable|string',
            'r2_bucket'            => 'nullable|string',
            'r2_url'               => 'nullable|url',
        ]);

        $fields = [
            'storage_driver', 'r2_account_id', 'r2_access_key_id',
            'r2_secret_access_key', 'r2_bucket', 'r2_url',
        ];

        foreach ($fields as $key) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $request->input($key, '')]
            );
        }

        // Sync to .env so Laravel filesystem driver picks it up
        $driver = $request->input('storage_driver', 'local');
        $envData = [
            'FILESYSTEM_DISK' => $driver === 'r2' ? 'r2' : 'public',
        ];

        if ($driver === 'r2') {
            $envData['CLOUDFLARE_R2_ACCOUNT_ID']    = $request->input('r2_account_id', '');
            $envData['CLOUDFLARE_R2_ACCESS_KEY_ID']  = $request->input('r2_access_key_id', '');
            $envData['CLOUDFLARE_R2_SECRET_ACCESS_KEY'] = $request->input('r2_secret_access_key', '');
            $envData['CLOUDFLARE_R2_BUCKET']         = $request->input('r2_bucket', '');
            $envData['CLOUDFLARE_R2_URL']            = $request->input('r2_url', '');
        }

        $this->updateEnv($envData);

        return redirect()->back()->with('success', 'Storage settings updated successfully.');
    }
}
