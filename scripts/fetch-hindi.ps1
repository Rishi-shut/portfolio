$r = Invoke-WebRequest -Uri "https://archive.org/metadata/jamendo-526975" -TimeoutSec 20 -UseBasicParsing
$f = ($r.Content | ConvertFrom-Json).files | Where-Object { $_.name -match "\.mp3$" } | Select-Object -First 1
$url = "https://archive.org/download/jamendo-526975/" + [uri]::EscapeDataString($f.name)
Write-Output "URL: $url"
Invoke-WebRequest -Uri $url -OutFile "$env:TEMP\opencode\music\hindi-full.mp3" -TimeoutSec 300 -UseBasicParsing
Get-Item "$env:TEMP\opencode\music\hindi-full.mp3" | Select-Object Name, Length | Format-List
