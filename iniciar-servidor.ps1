# =========================================================
# Servidor web local para el portal (no requiere instalar nada)
# Uso:  clic derecho > "Ejecutar con PowerShell"  o
#       powershell -ExecutionPolicy Bypass -File iniciar-servidor.ps1
# Luego abre http://localhost:8080
# =========================================================
param([int]$Puerto = 8080)

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$tipos = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8'
  '.json' = 'application/json'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.png' = 'image/png'; '.svg' = 'image/svg+xml'
  '.glb' = 'model/gltf-binary'; '.gltf' = 'model/gltf+json'; '.bin' = 'application/octet-stream'; '.mp3' = 'audio/mpeg'
  '.mp4' = 'video/mp4'; '.sql' = 'text/plain; charset=utf-8'; '.md' = 'text/plain; charset=utf-8'; '.ico' = 'image/x-icon'
}

$servidor = New-Object System.Net.HttpListener
$servidor.Prefixes.Add("http://localhost:$Puerto/")
$servidor.Start()
Write-Host "Portal Restauradores de la Memoria en http://localhost:$Puerto  (Ctrl+C para detener)"

try {
  while ($servidor.IsListening) {
    $ctx = $servidor.GetContext()
    $ruta = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ($ruta -eq '') { $ruta = 'index.html' }
    $archivo = [IO.Path]::GetFullPath((Join-Path $raiz $ruta))
    $resp = $ctx.Response
    if ($archivo.StartsWith($raiz) -and (Test-Path $archivo -PathType Leaf)) {
      $ext = [IO.Path]::GetExtension($archivo).ToLower()
      $resp.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { 'application/octet-stream' }
      $bytes = [IO.File]::ReadAllBytes($archivo)
      $resp.ContentLength64 = $bytes.Length
      if ($ctx.Request.HttpMethod -ne 'HEAD') { $resp.OutputStream.Write($bytes, 0, $bytes.Length) }
    } else {
      $resp.StatusCode = 404
    }
    $resp.Close()
  }
} finally {
  $servidor.Stop()
}
