<?php

namespace App\Policies;

use App\User;
use App\School;
use GuzzleHttp\Psr7\Request;
use Illuminate\Auth\Access\HandlesAuthorization;

class SchoolPolicy
{
    use HandlesAuthorization;

//    public function before($user, $ability)
//    {
//        if ($user->isSuperAdmin()) {
//            return true;
//        }
//    }
    /**
     * Determine whether the user can view any schools.
     *
     * @param  \App\User $user
     * @return mixed
     */


    /**
     * Determine whether the user can view the school.
     *
     * @param  \App\User $user
     * @param  \App\School $school
     * @return mixed
     */
    public function viewAny(User $user)
    {

        $permissions = $user->role()->first()->permissions;
        if (count($permissions) > 0 && (in_array('all', $permissions) || in_array('vs', $permissions)))
            return true;
        else return abort(403, 'متاسفانه اجازه دسترسی به این بخش را ندارید');
    }

    /**
     * Determine whether the user can create schools.
     *
     * @param  \App\User $user
     * @return mixed
     */
    public function createAny(User $user, $for = '')
    {
        $permissions = $user->role()->first()->permissions;
        if (count($permissions) > 0 && (in_array('all', $permissions) || in_array('cs', $permissions)))
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'متاسفانه اجازه  ساخت کاربر را ندارید');
        }
    }

    public function deleteAny(User $user, $for = '')
    {
        $permissions = $user->role()->first()->permissions;
        if (count($permissions) > 0 && (in_array('all', $permissions) || in_array('rs', $permissions)))
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'متاسفانه اجازه حذف کاربر را ندارید');
        }
    }

    public function editAny(User $user, $for = '')
    {
        $permissions = $user->role()->first()->permissions;
        if (count($permissions) > 0 && (in_array('all', $permissions) || in_array('es', $permissions)))
            return true;
        else {
            if ($for == 'can') //is in blade , only return true false
                return false;

            return abort(403, 'متاسفانه اجازه ویرایش کاربر را ندارید');
        }
    }

    /**
     * Determine whether the user can update the school.
     *
     * @param  \App\User $user
     * @param  \App\School $school
     * @return mixed
     */
    public function edit(User $user)
    {
        $hooze_id = School::findOrFail(request()->id)->first()->hooze_namayandegi_id;
        $roles = $user->role()->first()->permissions;
        $hoozes = $user->role()->first()->hooze_ids;

        if ((in_array('es', $roles) || in_array('all', $roles)) && (in_array('all', $hoozes) || in_array($hooze_id, $hoozes)))
            return true;
        else return false;
    }

    /**
     * Determine whether the user can delete the school.
     *
     * @param  \App\User $user
     * @param  \App\School $school
     * @return mixed
     */
    public function delete(User $user)
    {

        $hooze_id = School::findOrFail(request()->id)->first()->hooze_namayandegi_id;
        $roles = $user->role()->first()->permissions;
        $hoozes = $user->role()->first()->hooze_ids;

        if ((in_array('rs', $roles) || in_array('all', $roles)) && (in_array('all', $hoozes) || in_array($hooze_id, $hoozes)))
            return true;
        else return false;
    }

    /**
     * Determine whether the user can restore the school.
     *
     * @param  \App\User $user
     * @param  \App\School $school
     * @return mixed
     */
    public function restore(User $user, School $school)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the school.
     *
     * @param  \App\User $user
     * @param  \App\School $school
     * @return mixed
     */
    public function forceDelete(User $user, School $school)
    {
        //
    }
}
