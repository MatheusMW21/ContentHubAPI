FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["*.sln", "."]
COPY ["ContentHub/*.csproj", "ContentHub/"]
COPY ["ContentHub.Tests/*.csproj", "ContentHub.Tests/"]

RUN dotnet restore

COPY . .

RUN dotnet test --configuration Release --no-restore

RUN dotnet publish "ContentHub/ContentHub.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ContentHub.dll"]