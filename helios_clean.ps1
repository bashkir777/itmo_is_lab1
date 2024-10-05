$path_to_root = Get-Location
$path_to_backend_resources = "$path_to_root\backend\src\main\resources"

cd "$path_to_backend_resources"

if (Test-Path -Path "static") {
    Remove-Item -Recurse -Force static
}