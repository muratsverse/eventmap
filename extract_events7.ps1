$file = 'C:\Users\murat\.claude\projects\c--Users-murat-OneDrive-Masa-st--Eski-Proje-Eventmap\2548ca02-b5cb-427c-aaac-3d7edca1409f.jsonl'
$outFile = 'C:\Users\murat\event_data_raw.txt'

$lineNum = 0
foreach ($line in [System.IO.File]::ReadLines($file)) {
    $lineNum++
    if ($lineNum -eq 7112) {
        $json = $line | ConvertFrom-Json
        foreach ($block in $json.message.content) {
            if ($block.type -eq 'text' -and $block.text.Length -gt 5000) {
                $block.text | Out-File -FilePath $outFile -Encoding UTF8
                Write-Host "Saved $($block.text.Length) chars to $outFile"
            }
        }
        break
    }
}
