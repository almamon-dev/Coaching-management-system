<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a temporary JSON column
        Schema::table('categories', function (Blueprint $table) {
            $table->json('name_json')->nullable()->after('name');
        });

        // Migrate data
        $categories = \Illuminate\Support\Facades\DB::table('categories')->get();
        foreach ($categories as $category) {
            $name = $category->name;
            // If already valid JSON, don't double encode
            json_decode($name);
            if (json_last_error() === JSON_ERROR_NONE) {
                \Illuminate\Support\Facades\DB::table('categories')->where('id', $category->id)->update([
                    'name_json' => $name
                ]);
            } else {
                \Illuminate\Support\Facades\DB::table('categories')->where('id', $category->id)->update([
                    'name_json' => json_encode(['en' => $name, 'bn' => $name])
                ]);
            }
        }

        // Drop old column and rename the new one
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('name');
        });
        
        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('name_json', 'name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Create a temporary string column
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_string')->nullable()->after('name');
        });

        // Migrate data back
        $categories = \Illuminate\Support\Facades\DB::table('categories')->get();
        foreach ($categories as $category) {
            $decoded = json_decode($category->name, true);
            $nameStr = is_array($decoded) && isset($decoded['en']) ? $decoded['en'] : (string)$category->name;
            
            \Illuminate\Support\Facades\DB::table('categories')->where('id', $category->id)->update([
                'name_string' => $nameStr
            ]);
        }

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('name');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('name_string', 'name');
        });
    }
};
