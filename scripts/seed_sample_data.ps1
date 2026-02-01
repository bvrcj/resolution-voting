$ErrorActionPreference = "Stop"

param(
    [string]$BaseUrl = "http://localhost:8080"
)

function PostJson {
    param(
        [string]$Path,
        [object]$Body
    )

    $uri = ($BaseUrl.TrimEnd("/") + $Path)
    $payload = $Body | ConvertTo-Json -Depth 5
    return Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Body $payload
}

$rooms = @(
    @{ name = "Board Room A"; latitude = 12.9716; longitude = 77.5946 },
    @{ name = "Conference Hall B"; latitude = 13.0827; longitude = 80.2707 }
)

$users = @(
    @{ name = "Siva Vishnu"; email = "sivavishnu@lsvt.com"; role = "ADMIN" },
    @{ name = "Krishna V"; email = "krishna@lsvt.com"; role = "USER" },
    @{ name = "Archana V"; email = "archana@lsvt.com"; role = "USER" }
)

Write-Host "Creating rooms..."
$createdRooms = foreach ($room in $rooms) {
    PostJson "/api/rooms" $room
}

Write-Host "Creating users..."
$createdUsers = foreach ($user in $users) {
    PostJson "/api/users" $user
}

Write-Host "Creating resolution..."
$resolution = @{
    title = "Adopt new voting policy"
    description = "Adopt the updated voting policy for the board."
    roomId = $createdRooms[0].id
}
$createdResolution = PostJson "/api/resolutions" $resolution

Write-Host "Done."
Write-Host ("Rooms: " + (($createdRooms | ForEach-Object { $_.id } | Sort-Object) -join ", "))
Write-Host ("Users: " + (($createdUsers | ForEach-Object { $_.id } | Sort-Object) -join ", "))
Write-Host ("Resolution: " + $createdResolution.id)
