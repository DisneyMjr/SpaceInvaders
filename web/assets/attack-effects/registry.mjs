export const nativeAttackEffects={
  "fireball": {
    "path": "./assets/attack-effects/fireball.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  },
  "muzzle-glow": {
    "path": "./assets/attack-effects/muzzle-glow.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  },
  "sparks": {
    "path": "./assets/attack-effects/sparks.png",
    "columns": 2,
    "rows": 2,
    "frames": 4,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  },
  "smoke": {
    "path": "./assets/attack-effects/smoke.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "normal",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  },
  "shockwave": {
    "path": "./assets/attack-effects/shockwave.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      256,
      256
    ]
  },
  "plasma-glow": {
    "path": "./assets/attack-effects/plasma-glow.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  },
  "lightning": {
    "path": "./assets/attack-effects/lightning.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      256,
      256
    ]
  },
  "acid-ball": {
    "path": "./assets/attack-effects/acid-ball.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "normal",
    "frame_origin": "top-left",
    "size": [
      64,
      64
    ]
  },
  "acid-splat": {
    "path": "./assets/attack-effects/acid-splat.png",
    "columns": 4,
    "rows": 4,
    "frames": 16,
    "blend": "normal",
    "frame_origin": "top-left",
    "size": [
      256,
      256
    ]
  },
  "acid-glow": {
    "path": "./assets/attack-effects/acid-glow.png",
    "columns": 1,
    "rows": 1,
    "frames": 1,
    "blend": "additive",
    "frame_origin": "top-left",
    "size": [
      128,
      128
    ]
  }
};
export const attackEffectFiles=Object.values(nativeAttackEffects).map(effect=>effect.path);
