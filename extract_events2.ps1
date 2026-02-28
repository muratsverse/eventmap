$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'

# Find lines that contain "Ankara Caz" to understand the format
$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($line -match 'Ankara Caz Gecesi') {
        Write-Host "Found 'Ankara Caz Gecesi' at line $lineNum - Length: $($line.Length)"
        # Show first 500 chars
        Write-Host $line.Substring(0, [Math]::Min($line.Length, 500))
        Write-Host "---"
    }
}

# Also find the longest line (likely the event data)
Write-Host ""
Write-Host "Finding top 10 longest lines..."
$lineNum = 0
$lengths = @()
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    $lengths += [PSCustomObject]@{Line=$lineNum; Length=$line.Length}
}
$lengths | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "Line $($_.Line): $($_.Length) chars"
}
