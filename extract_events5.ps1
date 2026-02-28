$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'
$outFile = 'C:\Users\murat\event_data_raw.txt'

# Search for lines containing event-like data patterns
$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    # Look for the big user message with event data like "Atölye Festivali" or "Komedi Gecesi"
    if ($line.Length -gt 5000 -and $line -match 'Komedi Gecesi') {
        Write-Host "Line $lineNum - Length: $($line.Length)"
        $json = $line | ConvertFrom-Json
        Write-Host "userType: $($json.userType)"
        Write-Host "role: $($json.message.role)"

        $content = $json.message.content
        if ($content -is [array]) {
            foreach ($block in $content) {
                if ($block.type -eq 'text' -and $block.text.Length -gt 2000) {
                    Write-Host "Found large text block: $($block.text.Length) chars"
                    Write-Host "First 500: $($block.text.Substring(0, [Math]::Min($block.text.Length, 500)))"
                    $block.text | Out-File -FilePath $outFile -Encoding UTF8
                    Write-Host "Saved to $outFile"
                }
            }
        }
    }
}
