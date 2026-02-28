$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'
$outFile = 'C:\Users\murat\event_data_raw.txt'

# List all user messages and their sizes to find the one with event data
$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($line -match '"userType":"external"' -and $line -match '"role":"user"') {
        # Get text content length
        try {
            $json = $line | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($json.message.content) {
                $totalText = 0
                foreach ($block in $json.message.content) {
                    if ($block.type -eq 'text') {
                        $totalText += $block.text.Length
                    }
                }
                if ($totalText -gt 500) {
                    Write-Host "Line $lineNum - Total text: $totalText chars"
                    foreach ($block in $json.message.content) {
                        if ($block.type -eq 'text' -and $block.text.Length -gt 100) {
                            $preview = $block.text.Substring(0, [Math]::Min($block.text.Length, 200))
                            Write-Host "  Text: $preview"
                        }
                    }
                }
            }
        } catch {}
    }
}
