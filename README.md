# 🎬 Proyecto Spring Boot - Gestión de Cine (DAM1)

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Maven](https://img.shields.io/badge/Maven-3.9.0-blue.svg)
![Lombok](https://img.shields.io/badge/Lombok-v1.18.30-red.svg)

Este es un proyecto educativo desarrollado para el módulo de **Desarrollo de Aplicaciones Multiplataforma (DAM1)**. Se trata de una API REST construida con Spring Boot para la gestión de actores, directores, películas y alumnos.

---

## 🚀 Características

- **Gestión Completa de Cine**: Control de Actores, Directores y Películas.
- **Arquitectura Limpia**: Separación clara en capas (Controlador, Servicio, Repositorio y Dominio).
- **In-Memory Storage**: Implementación de repositorios utilizando listas dinámicas para demostración.
- **Lombok**: Uso de anotaciones para un código más limpio y legible.
- **Docker Compose ready**: Configuración base para despliegue en contenedores.

---

## 🏗️ Estructura del Proyecto

El proyecto sigue la estructura estándar de Spring Boot:

- `com.DAM.DAM1.Dominio`: Clases POJO que representan las entidades del sistema.
- `com.DAM.DAM1.Controlador`: Endpoints de la API REST.
- `com.DAM.DAM1.Servicio`: Lógica de negocio.
- `com.DAM.DAM1.Repositorio`: Persistencia (actualmente en memoria).

---

## 📡 Endpoints Principales

| Recurso | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Actores** | `GET` | `/actor` | Listar todos los actores |
| | `POST` | `/actor` | Registrar un nuevo actor |
| **Directores** | `GET` | `/director` | Listar todos los directores |
| | `POST` | `/director` | Registrar un nuevo director |
| **Películas** | `GET` | `/pelicula` | Listar todas las películas |
| | `POST` | `/pelicula` | Registrar una nueva película |
| **Alumnos** | `GET` | `/alumno` | Listar todos los alumnos |
| | `POST` | `/alumno` | Registrar un nuevo alumno |

---

## 🛠️ Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/alvarojimenezlopez56-pixel/Springboot.git
   cd Springboot
   ```

2. **Compilar y construir:**
   ```bash
   ./mvnw clean install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   ./mvnw spring-boot:run
   ```

La aplicación estará disponible en: `http://localhost:8099`

---

## 📝 Configuración

El archivo `src/main/resources/application.properties` contiene la configuración del servidor:
```properties
server.port=8099
spring.application.name=DAM1
```

---

## ✒️ Autor

* **Alvaro** - *Desarrollador Principal* - [alvarojimenezlopez56-pixel](https://github.com/alvarojimenezlopez56-pixel)

---
⌨️ con ❤️ por [Alvaro](https://github.com/alvarojimenezlopez56-pixel)
