# FUT Manager - Aplicación Full-Stack Premium

FUT Manager es una plataforma full-stack diseñada para la gestión completa de plantillas, jugadores y cromos estadísticas de **FUT (FIFA Ultimate Team)**. El sistema cuenta con una arquitectura de capas desacoplada en el backend, un mapeo automatizado y seguro mediante DTOs, y una interfaz de usuario interactiva y responsiva con estética premium oscura.

---

## 📁 Estructura del Repositorio

El workspace del proyecto está organizado de la siguiente manera:

* **`/backend`**: Proyecto Spring Boot (Java 21, Maven). Contiene la lógica empresarial, entidades JPA, DTOs, mapeadores de MapStruct y controladores REST.
* **`/frontend`**: Aplicación de una sola página (SPA) construida en React con Vite y CSS nativo premium.
* **`/agents`**: Carpeta de agentes de IA con archivos de instrucciones de lógica (`CodeAuditorAgent.txt`, `TestGeneratorAgent.txt`, `UiRefinerAgent.txt`).
* **`Agents.md`**: Explicación de la arquitectura de IA y el flujo de los agentes de desarrollo.
* **`DTO.md`**: Informe técnico detallado sobre el diseño de Data Transfer Objects en la aplicación (Ejercicio 4).
* **`MAPEO.md`**: Documentación teórica y gráfica sobre el mapeo automático usando MapStruct vs ModelMapper (Ejercicio 4).
* **`REVISION_BACKEND.md`**: Revisión del código backend identificando mejoras relativas a consultas N+1 y validaciones declarativas (Ejercicio 2).
* **`.codex/`**: Carpeta de configuración de agentes y metadatos de desarrollo.
* **`README.md`**: Este archivo explicativo de despliegue y funcionamiento.

---

## 🛠️ Tecnologías Utilizadas

* **Backend**: Spring Boot 3.x / 4.x, Spring Data JPA, Hibernate, MapStruct, JUnit 5, Mockito.
* **Frontend**: React (Vite), CSS3, Mermaid.js.
* **Base de Datos**: MySQL 8.x.
* **Entorno**: Java 21, Node.js v22+.

---

## 🚀 Instrucciones de Despliegue y Ejecución

### 1. Preparación de la Base de Datos (MySQL)
Asegúrese de tener un servidor MySQL activo con la base de datos `fut_manager` creada. Si está utilizando Docker, puede arrancarlo con las siguientes credenciales o las correspondientes a su contenedor:
* **Host**: `localhost` (o el host de su contenedor)
* **Puerto**: `3306`
* **Nombre BD**: `fut_manager`
* **Usuario**: `root`
* **Contraseña**: `password` (configurable en `backend/src/main/resources/application.properties`).

### 2. Configurar y Arrancar el Backend (Spring Boot)
1. Navegue al directorio del backend:
   ```bash
   cd backend
   ```
2. Defina su variable `JAVA_HOME` si es necesario (se requiere Java 21) y compile el proyecto:
   ```bash
   export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64   # Ajuste a su ruta de Java 21
   ./mvnw clean compile
   ```
3. Ejecute la aplicación Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```
   El backend estará disponible y escuchando peticiones en: **`http://localhost:8080`**.

### 3. Configurar y Arrancar el Frontend (React)
1. Abra una nueva terminal y navegue al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instale las dependencias e inicie el servidor de desarrollo Vite:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```
3. Abra el navegador web y acceda a la URL local indicada por Vite (normalmente **`http://localhost:5173`**).

---

## 💎 Características Clave del Proyecto

### ⚽ CRUD Completo e Interactividad
* **Equipos**: Listado de clubes, gestión de ligas, países y escudos.
* **Jugadores**: Creación de futbolistas asociados a los equipos creados en la plataforma.
* **Cartas FUT**: Diseñador visual de cartas con selección de tipo (Oro, Plata, Bronce, Icono, Especial), valoración (rating) y estadísticas del cromo de Ultimate Team (Ritmo, Tiro, Pase, Regate, Defensa, Físico).
* **FUT Card Visualizer**: Tarjetas CSS estilizadas que se actualizan dinámicamente y se comportan como los cromos físicos del videojuego.

### 🧪 Endpoint y Panel de Pruebas Unitarias Programáticas
* En lugar de depender de herramientas externas, el backend cuenta con un controlador expuesto en `GET /api/tests` que ejecuta dinámicamente la suite de pruebas unitarias mediante JUnit Platform Launcher.
* El frontend React cuenta con una sección dedicada que consume este endpoint y dibuja en tiempo real el porcentaje de éxito, fallos y detalles de ejecución del suite de tests unitarios del backend.

---

## 📚 Resumen de Ejercicios Realizados

1. **Ejercicio 1 (4 Puntos)**:
   * Implementado backend con Spring Boot, frontend con React y base de datos relacional MySQL.
   * Relaciones JPA para las tres entidades requeridas (`Jugador`, `Equipo`, `CartaFUT`).
   * Suite de pruebas unitarias con JUnit y Mockito, y endpoint `/api/tests` expuesto para ejecución dinámica.
   * Carpeta completa `/agents` con la lógica de agentes de IA y su documentación en `Agents.md`.
2. **Ejercicio 2 (1 Punto)**:
   * Análisis crítico detallado sobre optimizaciones de consultas JPA (N+1 Query) y validaciones de datos estructurados expuesto en `REVISION_BACKEND.md`.
3. **Ejercicio 3 (3 Puntos)**:
   * Flujo técnico de datos extremo a extremo (Frontend-to-Backend-to-DB) documentado con diagramas en la sección final de este repositorio y detallado en la entrega de video.
4. **Ejercicio 4 (2 Puntos)**:
   * Diseño, justificación e implementación completa de DTOs en el código y documentado en `DTO.md` (listo para exportar a PDF).
   * Mapeo de datos automático mediante **MapStruct** implementado y analizado gráficamente en `MAPEO.md`.
