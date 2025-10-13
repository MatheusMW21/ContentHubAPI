FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["*.sln", "."]
COPY ["ContentHub/*.csproj", "ContentHub/"]
COPY ["ContentHub.Tests/*.csproj", "ContentHub.Tests/"]

RUN dotnet restore "ContentHub/ContentHub.csproj"
RUN dotnet restore "ContentHub.Tests/ContentHub.Tests.csproj"

COPY . .

WORKDIR "/src/ContentHub.Tests"
RUN dotnet test --configuration Release --no-restore

WORKDIR "/src/ContentHub"
RUN dotnet publish "ContentHub.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ContentHub.dll"]