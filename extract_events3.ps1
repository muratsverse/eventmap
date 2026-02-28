$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'

# Read line 7023 (0-indexed: 7022)
$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($lineNum -eq 7023) {
        # Parse JSON and extract the text content
        $json = $line | ConvertFrom-Json

        # Check the message content
        $content = $json.message.content
        if ($content -is [array]) {
            foreach ($block in $content) {
                if ($block.type -eq 'text') {
                    # Write the text to a file
                    $block.text | Out-File -FilePath 'c:\Users\murat\OneDrive\Masaüstü\Eski Proje\Eventmap\event_data_raw.txt' -Encoding UTF8
                    Write-Host "Extracted text content to event_data_raw.txt"
                    Write-Host "Text length: $($block.text.Length)"
                    Write-Host "First 1000 chars:"
                    Write-Host $block.text.Substring(0, [Math]::Min($block.text.Length, 1000))
                    break
                }
            }
        } elseif ($content -is [string]) {
            $content | Out-File -FilePath 'c:\Users\murat\OneDrive\Masaüstü\Eski Proje\Eventmap\event_data_raw.txt' -Encoding UTF8
            Write-Host "Extracted string content"
            Write-Host "Length: $($content.Length)"
            Write-Host $content.Substring(0, [Math]::Min($content.Length, 1000))
        }

        Write-Host ""
        Write-Host "userType: $($json.userType)"
        Write-Host "role: $($json.message.role)"
        break
    }
}
