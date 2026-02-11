# Development

## Prereqs
- Node.js 18+
- npm

## Install

```bash
npm install
```

## Run (CLI)

```bash
npm start
# or
npm run dev
```

## Run (Web)

```bash
protoforge web
# opens http://localhost:3000 (default)
```

## Tests

```bash
npm test
```

## Formatting / Lint

(coming soon)

## Notes
- The project is ESM ("type": "module").
- Generated prototype outputs are written to `./protoforge-output/` by default.
- If generation fails, ProtoForge preserves the output folder with `prototype.raw.txt` and an error file to help debugging.
