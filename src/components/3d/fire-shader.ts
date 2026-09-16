import * as THREE from "three";

/**
 * High-fidelity volumetric fire shader for Three.js using 3D Simplex noise and temperature transfer function.
 */
export const FireShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBias: { value: 0.15 },
    uIntensity: { value: 1.4 },
    uSpeed: { value: 1.2 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      vec3 pos = position;

      float heightFactor = clamp(pos.y, 0.0, 3.0) / 3.0;
      float noise = snoise(vec3(pos.x * 2.2, pos.y * 1.8 - uTime * uSpeed * 2.8, pos.z * 2.2));
      pos.x += noise * 0.22 * heightFactor;
      pos.z += snoise(vec3(pos.x * 2.2 + 10.0, pos.y * 1.8 - uTime * uSpeed * 2.8, pos.z * 2.2)) * 0.22 * heightFactor;

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    float fbm(vec3 p) {
      float total = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        total += snoise(p) * amplitude;
        p *= 2.05;
        amplitude *= 0.5;
      }
      return total;
    }

    void main() {
      vec2 uv = vUv;
      float y = clamp(uv.y, 0.0, 1.0);
      
      vec3 noiseCoord = vec3(uv.x * 4.0, uv.y * 3.5 - uTime * uSpeed * 3.2, vPosition.z * 4.0);
      float noiseVal = fbm(noiseCoord);

      float shape = 1.0 - smoothstep(0.05, 0.95, y);
      float sideMask = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 2.2);
      sideMask = clamp(sideMask, 0.0, 1.0);

      float density = (shape * sideMask * 1.3) + noiseVal * 0.55;
      density = clamp(density - y * 0.45, 0.0, 1.0);

      if (density < 0.12) discard;

      // Realistic Dark-Fantasy Fire Color Ramp
      vec3 colCore = vec3(1.0, 0.95, 0.85);   // Soft warm white-gold core
      vec3 colBright = vec3(0.98, 0.58, 0.12); // Vibrant Amber
      vec3 colBody = vec3(0.85, 0.28, 0.05);   // Deep Ember Orange
      vec3 colRim = vec3(0.55, 0.10, 0.03);    // Dark Crimson
      vec3 colSmoke = vec3(0.08, 0.05, 0.04);  // Fading Ash Tip

      vec3 finalColor = colSmoke;
      if (density > 0.8) {
        finalColor = mix(colBright, colCore, (density - 0.8) / 0.2);
      } else if (density > 0.5) {
        finalColor = mix(colBody, colBright, (density - 0.5) / 0.30);
      } else if (density > 0.25) {
        finalColor = mix(colRim, colBody, (density - 0.25) / 0.25);
      } else {
        finalColor = mix(colSmoke, colRim, density / 0.25);
      }

      float alpha = clamp(density * 1.4 * (1.0 - y * 0.35), 0.0, 0.85);
      gl_FragColor = vec4(finalColor * uIntensity, alpha);
    }
  `,
};
