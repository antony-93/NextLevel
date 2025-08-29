# 📅 Sistema de Agendamento  
  
Objetivo: Criar um sistema de agendamento de aulas para uma rede de academias, com foco em **performance**, **escalabilidade**, principalmente em dispositivos móveis (85% dos acessos).  

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4-yellow?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-orange?logo=firebase)
![React Query](https://img.shields.io/badge/React_Query-critical?logo=react-query)
![Lighthouse](https://img.shields.io/badge/Lighthouse-Performance-brightgreen?logo=lighthouse)

---

## 🚀 Tecnologias utilizadas  

- **React + Vite** → base do projeto
- **Origin UI** → biblioteca de componentes pronta, boa para **aumentar a velocidade de desenvolvimento do projeto** e **performance**
- **React Query** → Gerenciamento de dados, com **cache inteligente** para consultas rápidas
- **Firebase (Firestore)** → banco de dados NoSQL em tempo real, projetado para lidar com **alto volume de acessos simultâneos** e garantir **baixa latência** nas operações  
- **Zod + React Hook Form** → validação segura e reativa nos formulários  
- **Lighthouse** → utilizado após o build da aplicação para medir **performance, acessibilidade e melhores práticas**  
- **PWA (Progressive Web App)** → configuração feita para que o sistema possa ser instalado em dispositivos móveis/desktop


---

## 🏗️ Arquitetura & Escalabilidade  

O projeto foi estruturado em **módulos independentes**, favorecendo **organização, reuso e desacoplamento**.  
Cada módulo (ex: `alunos`, `aulas`) importa apenas recursos de **shared**, evitando dependências cruzadas e facilitando manutenção e evolução do código.  


```plaintext
my-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── modules/
│   │   ├── members/
│   │   │   ├── repository/
│   │   │   ├── routes/
│   │   │   └── contexts/
│   │   └── sessions/
│   │       ├── screens/
│   │       ├── components/
│   │       └── etc...
│   ├── routes/
│   │   └── Router.tsx | Aponta arquivos de rotas de outros módulos
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── infra/
│   │   └── etc...
├── package.json
└── tsconfig.json
```

---

## ⚙️ Regras de Negócio (implementadas no front)  

- ✅ Aula não pode ultrapassar capacidade máxima de participantes  
- ✅ Aula finalizada não recebe novos participantes  
- ✅ Agendamento pós-início só é permitido se a aula estiver configurada para isso  

Essas regras foram aplicadas **tanto nos formularios quanto nas mutações utilzando validators**, garantindo feedback rápido (via **toasts**) e bloqueando ações inválidas.  

---

## 🎯 Foco no desafio  

- **Mobile First** → como 85% dos acessos seriam em dispositivos móveis, o design e a experiência foram priorizados para telas pequenas desde o início  
- **Validação segura** → formulários com Zod + RHF  
- **Performance** → React Query com cache + renderização otimizada via Origin UI  
- **Escalabilidade** → módulos independentes + Firebase, que suporta **alto volume de acessos simultâneos**  
- **Medição de performance real** → aplicação analisada com **Lighthouse após o build**, garantindo métricas sólidas de performance, acessibilidade e SEO  
- **Experiência fluida** → carregamento progressivo, feedback visual, telas responsivas  


## 📦 Como rodar o projeto  

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO/desafio-agendamento.git

# Instalar dependências
npm install

# Rodar a aplicação
npm run dev