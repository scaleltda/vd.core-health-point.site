# Campanha pelo Louis — Guia de Edição

Este é o site de arrecadação de fundos para o Louis. Abaixo estão instruções simples para editar o site sem precisar de conhecimento técnico.

---

## 1. Como trocar as fotos

As fotos ficam na pasta `images/`. Basta salvar os arquivos com os nomes corretos:

| Nome do arquivo           | Onde aparece no site                     |
|---------------------------|------------------------------------------|
| `placeholder-hero.jpg`    | Foto grande no topo da página (hero)     |
| `placeholder-foto1.jpg`   | Galeria — "Louis no começo de 2025"      |
| `placeholder-foto2.jpg`   | Galeria — "Louis nos dias de hoje"       |

**Como fazer:**
1. Salve a foto com o nome exato (ex: `placeholder-hero.jpg`)
2. Coloque o arquivo dentro da pasta `images/`
3. Abra o `index.html` no navegador — a foto vai aparecer automaticamente

**Dica:** Use fotos em formato JPG ou PNG. O tamanho ideal é 1920×900 pixels para a foto hero e 900×600 para as da galeria.

---

## 2. Como atualizar o valor arrecadado e o número de doadores

Abra o arquivo `script.js` e procure este bloco perto do início:

```javascript
const CAMPAIGN_DATA = {
  raised:  18440,   // valor arrecadado em euros
  goal:    45000,   // meta em euros
  donors:  247,     // número de doadores
};
```

Troque os números pelos valores reais e salve o arquivo. O site vai exibir os novos valores automaticamente.

---

## 3. Como editar os textos

Todos os textos estão no arquivo `index.html`. Para editar:

1. Abra o `index.html` com qualquer editor de texto (Bloco de Notas, TextEdit, VS Code, etc.)
2. Use `Ctrl+F` (ou `Cmd+F` no Mac) para procurar o trecho que quer editar
3. Faça a alteração e salve

---

## 4. Estrutura dos arquivos

```
louis-site/
├── index.html          ← Página principal (conteúdo e estrutura)
├── style.css           ← Visual e cores do site
├── script.js           ← Animações, modal de doação e integração de pagamento
├── images/
│   ├── placeholder-hero.jpg    ← INSERIR foto principal do Louis
│   ├── placeholder-foto1.jpg   ← INSERIR foto 1 da galeria
│   └── placeholder-foto2.jpg   ← INSERIR foto 2 da galeria
└── README.md           ← Este arquivo de instruções
```

---

## 5. Como publicar o site no GitHub Pages (grátis)

### Passo a passo completo:

#### Parte 1 — Criar conta e repositório no GitHub

1. Acesse **github.com** e clique em **"Sign up"** para criar uma conta gratuita
   - Escolha um nome de utilizador (ex: `emmalouisfamily`)
   - Use o seu e-mail e crie uma senha
   - Confirme o e-mail que o GitHub vai enviar para si

2. Após entrar na sua conta, clique no botão verde **"New"** (ou no símbolo `+` no canto superior direito → "New repository")

3. Na página de criação do repositório:
   - **Repository name:** escreva `louis-site`
   - Em "Visibility" selecione **Private** (⚠️ IMPORTANTE — ver nota de segurança abaixo)
   - Deixe todas as outras opções como estão
   - Clique em **"Create repository"**

#### Parte 2 — Enviar os ficheiros do site

4. Na página do repositório recém-criado, clique em **"uploading an existing file"**
   (ou no link "upload files" que aparece na página)

5. Arraste TODOS os ficheiros e a pasta `images/` para a área de upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - A pasta `images/` com todas as fotos dentro

6. Em baixo da página, no campo **"Commit changes"**, escreva uma mensagem curta como: `Primeiro upload do site`

7. Clique em **"Commit changes"** (botão verde)

#### Parte 3 — Ativar o GitHub Pages

8. Clique em **"Settings"** (no menu superior do repositório, ao lado de "Insights")

9. No menu lateral esquerdo, clique em **"Pages"**

10. Em **"Source"** (ou "Build and deployment"), selecione:
    - Branch: **main**
    - Pasta: **/ (root)**

11. Clique em **"Save"**

12. Aguarde 2 a 5 minutos. O GitHub vai mostrar uma mensagem verde com o endereço do seu site:
    `https://SEU-USUARIO.github.io/louis-site/`

#### Parte 4 — Verificar se está a funcionar

13. Acesse o endereço mostrado pelo GitHub — o site deve abrir normalmente
14. Clique no botão "Quero ajudar o Louis agora" para testar o modal de doação
15. Tente fazer uma doação de teste para verificar que o pagamento funciona

---

### ⚠️ Nota de segurança importante

O ficheiro `script.js` contém a chave de API da Cooud (`sk_live_...`). Por isso:

- **Mantenha o repositório como "Private"** (privado) — nunca mude para "Public"
- Com o repositório privado, o GitHub Pages continua a funcionar e o site fica público, mas o código-fonte fica protegido
- Se algum dia precisar de partilhar o código com alguém, partilhe apenas os ficheiros `index.html` e `style.css`

---

### Como atualizar o site depois de já estar publicado

Sempre que fizer alterações aos ficheiros:

1. Acesse **github.com** e entre no repositório `louis-site`
2. Clique no ficheiro que quer atualizar (ex: `script.js`)
3. Clique no ícone de lápis ✏️ (Edit this file)
4. Faça as alterações
5. Clique em **"Commit changes"** (botão verde)
6. O site atualiza automaticamente em menos de 2 minutos

---

## 6. Dúvidas frequentes

**O site não abre com duplo clique:**
Abra o arquivo `index.html` com o Google Chrome, Firefox ou Edge. Clique com o botão direito → "Abrir com" → escolha o navegador.

**As fotos não aparecem:**
Verifique se os nomes dos arquivos estão exatamente iguais (incluindo minúsculas/maiúsculas e a extensão `.jpg`).

**O modal de doação abre mas não avança para o pagamento:**
Certifique-se de que selecionou um valor antes de clicar em "Continuar". Se o problema persistir, pode ser uma restrição do navegador ao abrir o ficheiro localmente — publique no GitHub Pages e teste a partir do endereço online.
