<?php

namespace App\Controllers;

use Core\Routing\Controller;
use Core\Http\Request;

class WelcomeController extends Controller
{
    public function __invoke(): \Core\View\View
    {
        return $this->view('welcome', [
            'data' => 'PHP Framework'
        ]);
    }

    public function migrate(Request $request): string
    {
        if (!hash_equals(hash('sha3-512', env('APP_KEY')), $request->get('hash', ''))) {
            return '';
        }

        return sprintf('<pre>%s</pre>', \Core\Support\Console::call('migrasi --gen'));
    }
}
