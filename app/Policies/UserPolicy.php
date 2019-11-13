<?php

namespace App\Policies;

use App\Post;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\User $user
     * @return mixed
     */
    public function createPost(User $user, $for = '')
    {
        $role = $user->role;
        if ($role == 'Admin' || $role == 'Writer')
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'Sorry! You Can\'t Create Post');
        }
    }

    public function editUsers(User $user, $for = '')
    {
        $role = $user->role;
        if ($role == 'Admin')
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'Sorry! You Can\'t Edit Users');
        }
    }

    public function editPost(User $user, $user_id_post = null, $for = '')
    {
        $role = $user->role;
        if (($user_id_post == $user->id && $role == 'Writer') || $role == 'Admin')
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'Sorry! You Can\'t Edit Post');

        }
    }
}
