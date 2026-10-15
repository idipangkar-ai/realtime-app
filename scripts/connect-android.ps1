$ErrorActionPreference = 'Stop'
$realtimeRoot = Split-Path -Parent $PSScriptRoot
$realtimeTunnel = Join-Path $PSScriptRoot 'wsl-realtime-tunnel.js'
$realtimeListener = Get-NetTCPConnection -LocalPort 19000 -State Listen -ErrorAction SilentlyContinue
if ($realtimeListener) {
    $realtimeProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($realtimeListener.OwningProcess)"
    if ($realtimeProcess.CommandLine -notlike '*wsl-realtime-tunnel.js*') {
        throw 'Port 19000 is used by another application. Free that port before connecting.'
    }
} else {
    $realtimeNode = (Get-Command node).Source
    Start-Process -FilePath $realtimeNode -ArgumentList @(('"' + $realtimeTunnel + '"')) -WorkingDirectory $realtimeRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $env:TEMP 'realtime-usb-tunnel.log') -RedirectStandardError (Join-Path $env:TEMP 'realtime-usb-tunnel-error.log') | Out-Null
}

adb get-state
if ($LASTEXITCODE -ne 0) { throw 'Connect and authorize one Android device with USB debugging.' }
adb reverse tcp:8081 tcp:8081
if ($LASTEXITCODE -ne 0) { throw 'Could not connect Metro over USB.' }
adb reverse tcp:8000 tcp:8000
if ($LASTEXITCODE -ne 0) { throw 'Could not connect Frappe HTTP over USB.' }
adb reverse tcp:9000 tcp:19000
if ($LASTEXITCODE -ne 0) { throw 'Could not connect Frappe realtime over USB.' }
Write-Output 'USB connections ready: Metro 8081, Frappe 8000, realtime 9000.'
Write-Output 'Keep the Frappe bench in WSL and Metro running. Run this again after reconnecting USB.'
