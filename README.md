# ContentHub - Aplicação Full-Stack de "Read-it-Later"

[![React](https://img.shields.io/badge/React-TypeScript-blue?logo=react)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-9-blueviolet?logo=dotnet)](https://dotnet.microsoft.com/)
[![Azure](https://img.shields.io/badge/Deploy-Azure-blue?logo=microsoftazure)](https://portal.azure.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/MatheusMW21/content-hub-api/deploy.yml?branch=main&label=CI%2FCD)](https://github.com/MatheusMW21/content-hub-api/actions)

O ContentHub é uma aplicação web full-stack completa, construída do zero, que funciona como um serviço pessoal de "read-it-later". Este projeto demonstra um ciclo de vida de desenvolvimento de software moderno, desde a concepção de uma API segura, passando por testes automatizados, até ao deploy contínuo (CI/CD) de uma arquitetura híbrida na nuvem.

---

## Links da Aplicação

* **Frontend (React) na Vercel:** [https://content-hub-api-tau.vercel.app/](https://content-hub-api-tau.vercel.app/)
* **Backend (API .NET) no Azure:** [https://wirtzcontenthubapi.azurewebsites.net/swagger](https://wirtzcontenthubapi.azurewebsites.net/swagger)

---

## Funcionalidades Principais

* **Autenticação e Autorização:** Sistema de registo e login de múltiplos utilizadores com tokens **JWT**.
* **Organização Avançada:**
    * **Tags:** Adicione múltiplas tags a cada link.
    * **Filtros:** Filtre a sua lista de links instantaneamente ao clicar numa tag.
    * **Estado "Lido":** Mova links para uma secção de "Lidos" para manter a sua lista principal organizada.
* **Extração Automática de Títulos:** A API usa *web scraping* para buscar automaticamente o título de um link quando ele é adicionado.
* **Interface de Utilizador Moderna:**
    * **Design Responsivo:** Totalmente funcional em telemóveis e desktops.
    * **Tema Claro/Escuro:** Seletor de tema com persistência no `localStorage`.
    * **UX Polida:** Componentes interativos como Modais, formulários e validação no lado do cliente.

### Arquitetura e Tecnologias

Este projeto utiliza uma arquitetura de serviços híbrida, com o frontend servido por uma CDN global (Vercel) e o backend a correr como um serviço de contêiner (Azure).

**Frontend (client-app):**
* **React 18** com **TypeScript** e **Vite**
* **Roteamento:** React Router DOM
* **Estilização:** CSS Padrão com Variáveis (para temas)
* **Ícones:** React Icons

**Backend (ContentHub):**
* **.NET 9** (Minimal APIs e Controllers)
* **Base de Dados:** Entity Framework Core 9 com SQLite (persistido no Azure)
* **Segurança:** Autenticação JWT Bearer, BCrypt.Net (hashing de senhas), User Secrets, CORS.
* **Serviços:** `HtmlAgilityPack` para Web Scraping.

**Testes (ContentHub.Tests):**
* **Testes de Unidade:** xUnit e Moq (para simular dependências)
* **Testes de Integração:** `WebApplicationFactory` com uma base de dados SQLite em memória para testar o fluxo completo da API.

**DevOps & Cloud:**
* **CI/CD (Automação):** **GitHub Actions**
* **Containerização:** **Docker**
* **Deploy do Backend:** **Azure Container Registry** e **Azure App Service**.
* **Deploy do Frontend:** **Vercel**.

---

## Como Executar Localmente (Full-Stack)

Para executar o projeto completo na sua máquina, são necessários dois terminais.

**Pré-requisitos:**
* SDK do .NET 9
* Node.js 18+

### 1. Backend (.NET API)

No primeiro terminal, inicie a API (que corre por defeito em `https://localhost:7014`).

```bash
# 1. Navegue para a raiz do projeto
cd /caminho-para/read-it-later-proj

# 2. Configure os segredos da API
# (É necessário apenas na primeira vez)
dotnet user-secrets init --project ContentHub
dotnet user-secrets set "Jwt:Key" "SUA_CHAVE_SECRETA_LONGA_E_ALEATORIA_AQUI"
dotnet user-secrets set "Jwt:Issuer" "https://localhost:7014"
dotnet user-secrets set "Jwt:Audience" "https://localhost:7014"
dotnet user-secrets set "DefaultUser:Username" "wirtz"
dotnet user-secrets set "DefaultUser:Password" "SuaSenha@123"

# 3. Restaure, compile e execute a API
dotnet run --project ContentHub --launch-profile https
```
### 2. Frontend (React App)

No segundo terminal, inicie o cliente React.
```
# 1. Navegue para a pasta do cliente
cd /caminho-para/read-it-later-proj/client-app

# 2. Crie o seu ficheiro de ambiente local
# Crie um ficheiro chamado ".env.development"
# e adicione a seguinte linha:
VITE_API_BASE_URL=https://localhost:7014/api

# 3. Instale as dependências (necessário apenas na primeira vez)
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```
Abra http://localhost:5173 no seu navegador e a aplicação estará a funcionar!
