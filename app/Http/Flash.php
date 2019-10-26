<?php
/**
 * Created by PhpStorm.
 * User: MSI GS72
 * Date: 17/07/2018
 * Time: 09:01 PM
 */

namespace App\Http;


class Flash
{
    public function create($title, $message, $level)
    {
        return session()->flash('flash_message', [
            'title' => $title,
            'message' => $message,
            'level' => $level,
        ]);
    }

    public function info($title, $message)
    {
        return $this->create($title, $message, 'info');
    }

    public function success($title, $message)
    {
        return $this->create($title, $message, 'success');
    }

    public function warning($title, $message)
    {
        return $this->create($title, $message, 'warning');
    }

    public function error($title, $message)
    {
        return $this->create($title, $message, 'error');
    }

}