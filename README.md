# Hub de Conteúdo Pessoal (ContentHub API)

![.NET](https://img.shields.io/badge/.NET-9.0-blueviolet) ![C#](https://img.shields.io/badge/C%23-12-green) ![License](https://img.shields.io/badge/License-MIT-blue)

API RESTful desenvolvida em .NET 9 para criar um serviço pessoal de "Read-it-Later", permitindo salvar e gerenciar links de artigos, vídeos e outros conteúdos da web para consumo posterior.

## Sobre o Projeto

Este projeto nasceu da necessidade pessoal de organizar a grande quantidade de links interessantes que encontro diariamente. Em vez de deixá-los perdidos em abas do navegador ou em blocos de notas, criei esta API para centralizar, categorizar e gerenciar todo esse conteúdo de forma simples e eficiente.

O foco é ter um backend robusto e escalável que sirva como base para futuras aplicações cliente (web, mobile, etc.).

## Funcionalidades

- **Salvar Links:** Endpoint para adicionar novos links com URL, título e descrição.
- **Listar Conteúdo:** Endpoint para visualizar todos os links salvos, ordenados por data de adição.
- **Marcar como Lido:** Funcionalidade para marcar um link como consumido.
- **Deletar Links:** Endpoint para remover links da lista.
- **Documentação Interativa:** Interface do Swagger para visualizar e testar todos os endpoints facilmente.

## Tecnologias Utilizadas

- **[.NET 9](https://dotnet.microsoft.com/pt-br/download/dotnet/9.0):** Framework principal para a construção da API.
- **[ASP.NET Core](https://dotnet.microsoft.com/pt-br/apps/aspnet):** Para a criação de endpoints RESTful.
- **[Entity Framework Core 8](https://learn.microsoft.com/pt-br/ef/core/):** ORM para a comunicação com o banco de dados.
- **[SQLite](https://www.sqlite.org/index.html):** Banco de dados local utilizado para persistência dos dados.
- **[Swagger (Swashbuckle)](https://github.com/domaindrivendev/Swashbuckle.AspNetCore):** Para documentação e testes da API.

## Como Executar Localmente

Siga os passos abaixo para ter uma cópia do projeto rodando na sua máquina.

### Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/pt-br/download/dotnet/9.0)
- [Git](https://git-scm.com/downloads)
- Um editor de código de sua preferência (VS Code, Visual Studio, Rider)

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/MatheusMW21/content-hub-api.git](https://github.com/MatheusMW21/content-hub-api.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd content-hub-api
    ```

3.  **Instale as dependências do .NET:**
    ```bash
    dotnet restore
    ```

4.  **Aplique as migrações do Entity Framework para criar o banco de dados:**
    ```bash
    dotnet ef database update
    ```

5.  **Execute a aplicação:**
    ```bash
    dotnet run
    ```

6.  **Acesse a documentação Swagger** no seu navegador para testar os endpoints:
    `https://localhost:PORTA/swagger` (a porta será indicada no seu terminal, ex: 7001).


## Autor

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Matheus-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/matheuspinheiro08/)
[![GitHub](https://img.shields.io/badge/GitHub-MatheusMW21-181717?style=for-the-badge&logo=github)](https://github.com/MatheusMW21)
