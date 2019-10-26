<?php

namespace App\Http\Controllers;

use App\Group;
use App\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct()
    {
//        parent::__construct();
        $this->middleware('auth')->except(['showPost', 'showGroups', 'showLatestPosts', 'showGroupPosts']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Post $post
     * @return \Illuminate\Http\Response
     */
    public function showPost($group, $slug)
    {

        $post = Post::where('slug', '=', $slug)->with('group')->with('user')->with('comments.user:id,username')->with('comments.replies.user:id,username')->first();
        return view('post.single')->with(['post' => $post]);
    }

    public function showGroups()
    {
        $groups = Group:: all();
        return view('post.groups')->with('groups', $groups);
    }

    public function showLatestPosts(Request $request)
    {
        $request->validate([
            'num' => 'required|numeric|min:1|max:100',

        ]);

        return Post::orderBy('updated_at', 'DESC')->take($request->num)->with('user:id,username')->with('group')->get();
    }

    public function showGroupPosts(Request $request, $group)
    {

//        $request->validate([
//            'group' => 'required|string|min:1|max:100',
//            '_json' => 'sometimes|boolean',

//        ]);
//        return $request->group;
        if (!$request->page)
            $page = 1;
        else
            $page = $request->page;

        $path = [];
        $groups = Group::select('id', 'name')->where('name', 'like', '%' . $group . '%');#->with('user:id,username')
        $group_ids = $groups->pluck('id');
        if (count($group_ids) == 1) //this is subgroup group -> get root group for routing
            array_push($path, $groups->select('name')->first()['name'][0]);

        array_push($path, $group);

        $posts = Post::whereIn('group_id', $group_ids)->with('user:id,username')->with('group:id,name')->paginate(24, ['*'], 'page', $page);
//        return $posts;
//        if ($request->_json)
//            return $posts;

        return view('post.group')->with(['posts' => json_encode($posts), 'group' => $path]);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Post $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        //
    }
}
