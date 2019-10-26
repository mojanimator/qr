@if(session()->has('flash_message'))
    <script>


        swal.fire({
            title: "{{session('flash_message.title')}}",
            text: "{{session('flash_message.message')}}",
            {{--type: "{{session('flash_message.level')}}",--}}
            type: "{{session('flash_message.level')}}",
            cancelButtonText: "باشه",
            cancelButtonColor: '#d33',
            showCancelButton: true,
            showConfirmButton: false,
            showCloseButton: true,
//            timer: 2000,
        })
    </script>

@endif

@if(session()->has('flash_message_overlay'))

    <script>


        swal.fire({
            title: "{{session('flash_message_overlay.title')}}",
            text: "{{session('flash_message_overlay.message')}}",
            {{--type: "{{session('flash_message_overlay.level')}}",--}}
            type: "{{session('flash_message_overlay.level')}}",
            cancelButtonText: "باشه",
            cancelButtonColor: '#d33',
            showCancelButton: true,
            showConfirmButton: false,
        })
    </script>

@endif