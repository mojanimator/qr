<?php
/**
 * Created by PhpStorm.
 * User: MSI GS72
 * Date: 25/07/2019
 * Time: 11:54 AM
 */

namespace App\Policies;


use App\Hooze;
use App\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;


//    public function before($user, $ability)
//    {
//
//        if (auth()->user())
//            return true;
//        else return abort(403, 'برای دسترسی ابتدا باید وارد شوید');
//
//
//    }

    public function viewAny(User $user)
    {
        $permissions = $user->role()->first()->permissions;
        if (count($permissions) > 0 && (in_array('all', $permissions) || in_array('vr', $permissions)))
            return true;
        else return abort(403, 'متاسفانه اجازه مشاهده گزارشات را ندارید');
    }

}