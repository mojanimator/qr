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

class HoozePolicy
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

    /**
     * HoozePolicy constructor.
     */

    public function __construct()
    {

    }

    public function viewAny(User $user)
    {
        $hooze_ids = $user->role()->first()->hooze_ids;
        if (in_array('all', $hooze_ids) || count($hooze_ids) > 0)
            return true;
        else return abort(403, 'متاسفانه اجازه دسترسی به این بخش را ندارید');
    }

    public function deleteAny(User $user)
    {
        $permissions = $user->role()->first()->permissions;
        if (in_array('all', $permissions) || in_array('rh', $permissions))
            return true;
        else return false;
    }

    public function createAny(User $user)
    {
        $permissions = $user->role()->first()->permissions;
        if (in_array('all', $permissions) || in_array('ch', $permissions))
            return true;
        else return false;
    }

    public function editAny(User $user)
    {

        $permissions = $user->role()->first()->permissions;
        if (in_array('all', $permissions) || in_array('eh', $permissions))
            return true;
        else return false;
    }

    public function create(User $user)
    {
        $permissions = $user->role()->first()->permissions;
        if (in_array('all', $permissions) || in_array('ch', $permissions))
            return true;
        else return abort(403, 'متاسفانه اجازه ساخت حوزه نمایندگی را ندارید');
    }


    public function view(User $user)
    {

        $permissions = $user->role()->first()->permissions;
        if (in_array('all', $permissions) || in_array('vh', $permissions))
            return true;
        else return abort(403, 'متاسفانه اجازه مشاهده حوزه های نمایندگی را ندارید');
    }


    public function edit(User $user, $hooze_id)
    {

        $roles = $user->role()->first()->permissions;
        $hoozes = $user->role()->first()->hooze_ids;
        $parent_hooze_id = Hooze::where('id', $hooze_id)->first()->parent_id;


        if ((in_array('eh', $roles) || in_array('all', $roles)) && (in_array($hooze_id, $hoozes) || in_array('all', $hoozes))
            && (in_array('all', $hoozes) || in_array($parent_hooze_id, $hoozes) || $parent_hooze_id == null))
            return true;
        else return abort(403, 'متاسفانه اجازه ویرایش حوزه نمایندگی را ندارید');
    }


    public
    function delete(User $user, $hooze_id)
    {
        $roles = $user->role()->first()->permissions;
        $hoozes = $user->role()->first()->hooze_ids;

        if ((in_array('all', $roles) || in_array('rh', $roles)) && in_array($hooze_id, $hoozes))
            return true;
//        else return abort(403, 'متاسفانه اجازه دسترسی به این بخش را ندارید');
        else return abort(403, 'متاسفانه اجازه حذف حوزه نمایندگی را ندارید');
    }

    public
    function restore(User $user, Hooze $hooze)
    {
        //
    }


    public
    function forceDelete(User $user, Hooze $school)
    {
        //
    }
}