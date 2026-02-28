$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'
$outFile = 'C:\Users\murat\event_data_raw.txt'

# Read line 7023 and find all text blocks
$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($lineNum -eq 7023) {
        $json = $line | ConvertFrom-Json
        Write-Host "userType: $($json.userType)"
        Write-Host "role: $($json.message.role)"

        $content = $json.message.content
        Write-Host "Content count: $($content.Count)"

        foreach ($block in $content) {
            Write-Host "Block type: $($block.type), length: $($block.text.Length)"
            if ($block.type -eq 'text' -and $block.text.Length -gt 1000) {
                $block.text | Out-File -FilePath $outFile -Encoding UTF8
                Write-Host "Saved large text block to $outFile"
            }
        }
        break
    }
}
