$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'

# Find the largest "human" message which should be the event data
$lineNum = 0
$maxLen = 0
$maxLineNum = 0

foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($line -match '"userType":"human"' -or $line -match '"role":"human"') {
        if ($line.Length -gt $maxLen) {
            $maxLen = $line.Length
            $maxLineNum = $lineNum
        }
        Write-Host "Human message at line $lineNum - Length: $($line.Length)"
    }
}

Write-Host ""
Write-Host "Largest human message at line $maxLineNum with $maxLen chars"
