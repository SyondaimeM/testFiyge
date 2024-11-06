<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = ['form_name', 'form_data'];

    protected $casts = [
        'form_data' => 'array', // Cast the form_data column to an array
    ];
}
