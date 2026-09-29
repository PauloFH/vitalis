# Vitalis

Jogo web (web app) sobre **hábitos saudáveis**. Você guia um mascote por 7 dias, faz escolhas de
alimentação, hidratação, movimento, sono e mente, e tenta manter a **saúde** alta. Ao fim, um
quiz de bônus. Tudo em HTML/CSS/JS — sem backend, pronto para **GitHub Pages**.

## Stack
- **mise** — gerenciador de ferramentas (Node 22)
- **Vite** — dev server + build estático
- **JS puro** (ES module) + CSS + HTML — sem framework
- Deploy: **GitHub Pages** (estático)

## Rodar local (WSL)
```bash
cd /mnt/d/projects/vitalis
mise install          # instala node 22 via mise
npm install
npm run dev           # dev server em http://localhost:5173
npm run build         # gera dist/ (estático)
```

## Publicar no GitHub Pages
1. Crie um repositório público no GitHub (ex.: `seu-usuario.github.io` para site de usuário,
   ou qualquer repo para site de projeto).
2. `git remote add origin https://github.com/SEU_USUARIO/REPO.git`
3. `git add -A && git commit -m "Vitalis"`
4. `git push -u origin main`
5. Ative **GitHub Pages** nas configurações do repo (source: branch `main`).
6. Acesse `https://SEU_USUARIO.github.io/` (ou `.../vitalis/` para site de projeto).

## Estrutura
```
index.html      # UI e telas
css/style.css   # tema
js/main.js      # estado + regras + rendering
favicon.svg     # ícone
docs/references.md # referências de arte e saúde
```
