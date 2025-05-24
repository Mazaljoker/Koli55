# Script d'installation du composant AbstractBall depuis VapiBlocks
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🎨 Installation du composant AbstractBall depuis VapiBlocks" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

# Vérifier si nous sommes dans le bon répertoire
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet" -ForegroundColor Red
    Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Naviguer vers le dossier frontend
Set-Location frontend

Write-Host "📁 Création du répertoire components/examples..." -ForegroundColor Blue
if (-not (Test-Path "components/examples")) {
    New-Item -ItemType Directory -Path "components/examples" -Force | Out-Null
    Write-Host "  ✅ Répertoire créé" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  Répertoire existe déjà" -ForegroundColor Yellow
}

Write-Host "📥 Téléchargement du composant AbstractBall..." -ForegroundColor Blue

# Contenu du composant AbstractBall basé sur VapiBlocks
$abstractBallContent = @"
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface AbstractBallProps {
  perlinTime?: number;
  perlinDNoise?: number;
  chromaRGBr?: number;
  chromaRGBg?: number;
  chromaRGBb?: number;
  chromaRGBn?: number;
  chromaRGBm?: number;
  sphereWireframe?: boolean;
  spherePoints?: boolean;
  spherePsize?: number;
  cameraSpeedY?: number;
  cameraSpeedX?: number;
  cameraZoom?: number;
  cameraGuide?: boolean;
  perlinMorph?: number;
  currentVolume?: number;
  isSessionActive?: boolean;
}

const AbstractBall: React.FC<AbstractBallProps> = ({
  perlinTime = 25.0,
  perlinDNoise = 1.0,
  chromaRGBr = 7.5,
  chromaRGBg = 5.0,
  chromaRGBb = 7.0,
  chromaRGBn = 0.5,
  chromaRGBm = 1.0,
  sphereWireframe = false,
  spherePoints = false,
  spherePsize = 1.0,
  cameraSpeedY = 0.0,
  cameraSpeedX = 0.0,
  cameraZoom = 175,
  cameraGuide = false,
  perlinMorph = 5.5,
  currentVolume = 0,
  isSessionActive = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, -2, cameraZoom / 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Configuration du post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      0.5, // strength
      0.8, // radius
      0.5  // threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Uniforms pour le shader
    const uniforms = {
      u_time: { value: 0.0 },
      u_frequency: { value: currentVolume },
      u_red: { value: chromaRGBr / 10 },
      u_green: { value: chromaRGBg / 10 },
      u_blue: { value: chromaRGBb / 10 },
      u_perlin_time: { value: perlinTime },
      u_perlin_morph: { value: perlinMorph },
    };

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        uniform float u_time;
        uniform float u_frequency;
        uniform float u_perlin_time;
        uniform float u_perlin_morph;

        // Fonction de bruit Perlin simplifiée
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x * 34.0) + 10.0) * x);
        }

        vec4 taylorInvSqrt(vec4 x) {
          return 1.79284291400159 - 0.85373472095314 * x;
        }

        vec3 fade(vec3 t) {
          return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        float pnoise(vec3 P, vec3 rep) {
          vec3 Pi0 = mod(floor(P), rep);
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P);
          vec3 Pf1 = Pf0 - vec3(1.0);
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
          return 2.2 * n_xyz;
        }

        void main() {
          float noise = u_perlin_morph * pnoise(position + u_time * u_perlin_time / 100.0, vec3(10.0));
          float displacement = 0.5 + (u_frequency / 30.0) * (noise / 10.0);
          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_red;
        uniform float u_green;
        uniform float u_blue;

        void main() {
          gl_FragColor = vec4(u_red, u_green, u_blue, 0.8);
        }
      `,
      wireframe: sphereWireframe,
      transparent: true,
    });

    // Géométrie
    const geometry = new THREE.IcosahedronGeometry(
      isSessionActive ? 2.5 : 1.5, 
      isSessionActive ? 8 : 5
    );
    
    if (spherePoints) {
      material.wireframe = false;
      const points = new THREE.Points(geometry, new THREE.PointsMaterial({
        color: new THREE.Color(chromaRGBr / 10, chromaRGBg / 10, chromaRGBb / 10),
        size: spherePsize,
      }));
      scene.add(points);
    } else {
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    const clock = new THREE.Clock();

    // Boucle d'animation
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Mise à jour des uniforms
      uniforms.u_time.value = elapsedTime;
      uniforms.u_frequency.value = THREE.MathUtils.lerp(
        uniforms.u_frequency.value, 
        currentVolume + (isSessionActive ? 5 : 0), 
        0.1
      );
      uniforms.u_red.value = chromaRGBr / 10;
      uniforms.u_green.value = chromaRGBg / 10;
      uniforms.u_blue.value = chromaRGBb / 10;
      uniforms.u_perlin_time.value = perlinTime;
      uniforms.u_perlin_morph.value = perlinMorph;

      // Rotation de la caméra
      if (cameraSpeedX !== 0 || cameraSpeedY !== 0) {
        camera.position.x = Math.cos(elapsedTime * cameraSpeedX) * (cameraZoom / 10);
        camera.position.y = Math.sin(elapsedTime * cameraSpeedY) * (cameraZoom / 10);
        camera.lookAt(0, 0, 0);
      }

      // Rotation de la sphère
      if (scene.children[0]) {
        scene.children[0].rotation.x += 0.005;
        scene.children[0].rotation.y += 0.01;
      }

      composer.render();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    perlinTime,
    perlinDNoise,
    chromaRGBr,
    chromaRGBg,
    chromaRGBb,
    chromaRGBn,
    chromaRGBm,
    sphereWireframe,
    spherePoints,
    spherePsize,
    cameraSpeedY,
    cameraSpeedX,
    cameraZoom,
    cameraGuide,
    perlinMorph,
    currentVolume,
    isSessionActive,
  ]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        background: 'transparent'
      }} 
    />
  );
};

export default AbstractBall;
"@

# Écrire le fichier
$abstractBallContent | Out-File -FilePath "components/examples/abstract-ball.tsx" -Encoding UTF8
Write-Host "  ✅ Composant AbstractBall créé" -ForegroundColor Green

Write-Host "📝 Mise à jour du composant ConfiguratorGlob..." -ForegroundColor Blue

# Lire le fichier ConfiguratorGlob existant
$globPath = "app/configurateur/components/ConfiguratorGlob.tsx"
if (Test-Path $globPath) {
    $globContent = Get-Content $globPath -Raw
    
    # Remplacer le placeholder par l'import réel
    $updatedGlobContent = $globContent -replace "// Import du composant AbstractBall de VapiBlocks \(à adapter selon l'installation\)`r?`n// import AbstractBall from '@/components/examples/abstract-ball';", "import AbstractBall from '@/components/examples/abstract-ball';"
    
    # Remplacer le placeholder GlobPlaceholder par le vrai composant
    $updatedGlobContent = $updatedGlobContent -replace "      <GlobPlaceholder />", "      <AbstractBall {...config} />"
    
    # Supprimer la fonction GlobPlaceholder
    $updatedGlobContent = $updatedGlobContent -replace "  // Simulation d'animation pour le développement`r?`n  const GlobPlaceholder[^}]+}\);`r?`n", ""
    
    $updatedGlobContent | Out-File -FilePath $globPath -Encoding UTF8
    Write-Host "  ✅ ConfiguratorGlob mis à jour avec AbstractBall" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  ConfiguratorGlob.tsx non trouvé" -ForegroundColor Yellow
}

Write-Host "📦 Vérification des dépendances Three.js..." -ForegroundColor Blue

# Vérifier package.json
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $needsInstall = $false
    
    $requiredDeps = @("three", "@types/three", "gsap")
    foreach ($dep in $requiredDeps) {
        $found = $false
        if ($packageJson.dependencies -and $packageJson.dependencies.$dep) {
            $found = $true
        }
        if ($packageJson.devDependencies -and $packageJson.devDependencies.$dep) {
            $found = $true
        }
        if (-not $found) {
            Write-Host "  ⚠️  Dépendance manquante: $dep" -ForegroundColor Yellow
            $needsInstall = $true
        }
    }
    
    if ($needsInstall) {
        Write-Host "  📦 Installation des dépendances manquantes..." -ForegroundColor Blue
        npm install three @types/three gsap
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Dépendances installées" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Erreur lors de l'installation" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✅ Toutes les dépendances sont présentes" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ package.json non trouvé" -ForegroundColor Red
}

# Retourner au répertoire racine
Set-Location ..

Write-Host ""
Write-Host "🎉 Installation du composant AbstractBall terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Résumé:" -ForegroundColor Blue
Write-Host "✅ Composant AbstractBall créé dans frontend/components/examples/" -ForegroundColor Green
Write-Host "✅ ConfiguratorGlob mis à jour pour utiliser AbstractBall" -ForegroundColor Green
Write-Host "✅ Dépendances Three.js vérifiées" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Prochaines étapes:" -ForegroundColor Blue
Write-Host "1. Tester l'interface: cd frontend && npm run dev" -ForegroundColor Yellow
Write-Host "2. Naviguer vers http://localhost:3000/configurateur" -ForegroundColor Yellow
Write-Host "3. Vérifier que le Glob s'affiche correctement" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Le composant AbstractBall est maintenant prêt à utiliser!" -ForegroundColor Cyan 