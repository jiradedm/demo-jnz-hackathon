# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Deploy to GitHub Pages

CI/CD ใช้ GitHub Actions: เมื่อ push ไปที่ branch `main` จะ build และ deploy ไปยัง GitHub Pages อัตโนมัติ

1. **สร้าง repo ใหม่บน GitHub** (ไม่ต้องเพิ่ม README/gitignore)
2. **เพิ่ม remote และ push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. **เปิด GitHub Pages:** Repo → **Settings** → **Pages** → **Source** เลือก **GitHub Actions**
4. หลัง workflow รันเสร็จ ไซต์จะอยู่ที่ `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Deploy API ไปยัง Vercel

API (Express) อยู่ใน `apps/api` สามารถ deploy เป็นโปรเจกต์แยกบน Vercel ได้ดังนี้

1. **เชื่อม Repo กับ Vercel**
   - ไปที่ [vercel.com/new](https://vercel.com/new) แล้ว Import Git repository ของโปรเจกต์นี้

2. **ตั้งค่าโปรเจกต์ (สำคัญสำหรับ monorepo)**
   - **Root Directory:** กด **Edit** แล้วเลือกโฟลเดอร์ `apps/api` (ไม่ใช้ root ของ repo)
   - **Framework Preset:** เลือก **Other** (หรือปล่อยให้ Vercel detect Express)
   - **Build Command:** ว่างไว้ได้ (Vercel รัน TypeScript โดยตรง)
   - **Install Command:** ใช้ค่าจาก `apps/api/vercel.json` คือ `cd ../.. && pnpm install --filter api`

3. **Deploy**
   - กด **Deploy** หลัง deploy เสร็จ API จะมี URL แบบ `https://your-api-xxx.vercel.app`
   - ตัวอย่าง endpoint: `GET https://your-api-xxx.vercel.app/health` จะได้ `{ "status": "ok" }`

**Health check URL (โปรเจกต์นี้):**

- Base: `https://demo-jnz-hackathon-jan-2026-m9tyxefqe-jiradedms-projects.vercel.app/`
- Health: `https://demo-jnz-hackathon-jan-2026-m9tyxefqe-jiradedms-projects.vercel.app/health`

4. **รัน API บนเครื่อง (local)**
   ```bash
   pnpm dev:api
   ```
   หรือจาก root: `pnpm --filter api dev`
