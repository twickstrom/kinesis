# Changelog

## [1.0.8](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.7...kinesis-v1.0.8) (2026-03-19)


### Bug Fixes

* **naming conventions:** updated naming convention from animate-easings-* to animate-ease-* ([4bd030f](https://github.com/twickstrom/kinesis/commit/4bd030fd1a3d567e6871d0d6ada0ffcf3b844c2a))

## [1.0.7](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.6...kinesis-v1.0.7) (2026-03-09)


### Bug Fixes

* **physics:** update ease-mario-jump to map jump velocity over horizontal translation ([ae58a9c](https://github.com/twickstrom/kinesis/commit/ae58a9ce02da9a1d6359f827e031b98dec5223a1))
* **physics:** update ease-mario-jump to resolve at 1 to prevent snap-back in A-to-B transitions ([cd3f759](https://github.com/twickstrom/kinesis/commit/cd3f75947ee4fa5017c11a16c5ddf8d32044d08b))

## [1.0.6](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.5...kinesis-v1.0.6) (2026-03-09)


### Bug Fixes

* **physics:** improve ease-mario-jump math for accurate parabolic arc and hang-time ([9532b59](https://github.com/twickstrom/kinesis/commit/9532b5998ee2dc8543c0982a2aecec3ea0d69a61))

## [1.0.5](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.4...kinesis-v1.0.5) (2026-03-09)


### Bug Fixes

* **build:** correctly offset regex index so category headers align with first token ([f2987f3](https://github.com/twickstrom/kinesis/commit/f2987f387be837bee81432b687b7f3a9fe9bc638))
* **build:** perfectly preserve full JSDoc headers and category blocks for TS exports ([70f1001](https://github.com/twickstrom/kinesis/commit/70f1001eb7a6c9c20907e937e265c7940c5f1865))

## [1.0.4](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.3...kinesis-v1.0.4) (2026-03-09)


### Bug Fixes

* **jsr:** restore dedicated jsr config and sync with release-please ([2fc5f76](https://github.com/twickstrom/kinesis/commit/2fc5f767ce710a873da7c3fb969a3eb83685a75d))

## [1.0.3](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.2...kinesis-v1.0.3) (2026-03-09)


### Bug Fixes

* **ci:** remove --provenance flag from jsr command as it is implicit via OIDC ([64aa7a0](https://github.com/twickstrom/kinesis/commit/64aa7a0d89a9489815aa4cec830670ca0ebf07fb))


### Miscellaneous Chores

* force bump to 1.0.3 to clear registry desync ([5269886](https://github.com/twickstrom/kinesis/commit/5269886fc455fbc13345498ba07fe5324485f557))

## [1.0.2](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.1...kinesis-v1.0.2) (2026-03-09)


### Bug Fixes

* **ci:** unify jsr config in package.json and add provenance flag ([37fbdfb](https://github.com/twickstrom/kinesis/commit/37fbdfb5346db5a26011c78efc28c3c3c529be37))
* **jsr:** explicitly declare name and version in jsr config block ([368fe0d](https://github.com/twickstrom/kinesis/commit/368fe0d46140e088500446bd004f5bd7d296c722))

## [1.0.1](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.0...kinesis-v1.0.1) (2026-03-09)


### Bug Fixes

* **ci:** manually configure npmrc auth for setup-bun ([804a7f8](https://github.com/twickstrom/kinesis/commit/804a7f8b7c2b0c528b1bf9c36a9ce2860959c0dd))

## [1.0.0](https://github.com/twickstrom/kinesis/compare/kinesis-v1.0.0...kinesis-v1.0.0) (2026-03-09)

### Features

- initial release of kinesis ([d57d3f8](https://github.com/twickstrom/kinesis/commit/d57d3f85eff4052b8026f3598d59c9d13a1cf045))

### Bug Fixes

- **ci:** install @eslint/js for flat config ([1d6de53](https://github.com/twickstrom/kinesis/commit/1d6de539063b2e61007f78fc0a5844ea58c56210))

### Miscellaneous Chores

- force release to 1.0.0 ([40bcd44](https://github.com/twickstrom/kinesis/commit/40bcd449bef76467922249068382000f5a3f869e))
