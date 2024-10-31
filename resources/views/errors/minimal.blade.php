<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title')</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <!-- Google Fonts -->
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Source+Sans+Pro:wght@400;600&display=swap"
            rel="stylesheet">

        <!-- Include Vite resources -->
        @vite('resources/css/app.scss')
    </head>
    <body class="d-flex align-items-center justify-content-center min-vh-100 bg-light text-secondary">
        <div class="container text-center">
            <h1 class="mb-0 display-3">@yield('code')</h1>
            <p>@yield('message')</p>

            @if(trim($__env->yieldContent('code')) === '404')
                <a href="{{ url('/') }}" class="btn btn-primary">Kembali</a>
            @endif
        </div>
    </body>
</html>
