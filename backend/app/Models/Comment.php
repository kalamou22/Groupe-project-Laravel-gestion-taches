<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['texte', 'auteur_id', 'task_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
