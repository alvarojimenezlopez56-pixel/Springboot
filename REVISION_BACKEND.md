# Revisión del Código Backend y Propuestas de Mejora (Ejercicio 2)

Este documento contiene la revisión técnica de la arquitectura backend implementada para la aplicación **FUT Manager**, identificando aspectos mejorables en base a las buenas prácticas y patrones explicados en clase.

---

## 🔍 Mejora 1: Resolución del Problema de Consultas N+1 (Rendimiento de Base de Datos)

### 📌 Diagnóstico del Problema
En el servicio de jugadores (`JugadorService.java`), el método `findAll()` realiza la siguiente operación:
1. Consulta la lista completa de jugadores en la base de datos: `jugadorRepository.findAll()`.
2. Para cada jugador, durante el mapeo automático a `JugadorDTO`, el mapper llama a `jugador.getEquipo().getNombre()` y `jugador.getEquipo().getId()`.
3. Al estar configurada la relación como perezosa (`fetch = FetchType.LAZY`), Hibernate se ve obligado a realizar una consulta SQL individual a la tabla `equipos` por cada jugador de la lista.

Si tenemos **N jugadores**, esto desencadena **1 consulta inicial + N consultas adicionales** (Problema N+1), sobrecargando el servidor de base de datos MySQL de forma exponencial.

### 🛠️ Solución Recomendada: Carga Ansiosa (Eager Join Fetch)
Para solucionar esto, debemos indicar a Spring Data JPA que cargue la relación `equipo` mediante un `JOIN FETCH` en una única consulta SQL.

Podemos conseguirlo modificando `JugadorRepository.java` de la siguiente forma:

```java
package com.example.futmanager.repository;

import com.example.futmanager.model.Jugador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {

    // Opción A: Consulta personalizada con JOIN FETCH
    @Query("SELECT j FROM Jugador j LEFT JOIN FETCH j.equipo")
    List<Jugador> findAllWithEquipo();

    // Opción B: Declaración de EntityGraph para carga ansiosa de la relación
    @EntityGraph(attributePaths = {"equipo"})
    List<Jugador> findAll();
}
```

Al utilizar la Opción B (`@EntityGraph`), Spring Data JPA reescribe internamente la consulta de obtención para realizar un `LEFT OUTER JOIN` trayendo toda la información en un solo viaje a la base de datos.

---

## 🔍 Mejora 2: Validación Declarativa en DTOs con Jakarta Validation

### 📌 Diagnóstico del Problema
Actualmente, la validación de los datos (por ejemplo, asegurar que el rating y atributos de las cartas FUT estén en el rango de 1 a 99) está acoplada dentro de la lógica del servicio (`CartaFUTService.java`) mediante código imperativo tradicional (`validateStats(dto)` con condicionales `if`).

Esto presenta varios inconvenientes:
1. Ensucia la capa de servicio con validaciones de formato de datos.
2. Si se añade otra entrada (por ejemplo, otro controlador o API pública), la validación debe duplicarse o llamarse manualmente.
3. Las respuestas de error devuelven excepciones genéricas en vez de errores de validación de campos estandarizados.

### 🛠️ Solución Recomendada: Validación Declarativa
Podemos añadir la dependencia de validación de Spring Boot al `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Y luego anotar directamente los DTOs con anotaciones declarativas estándar (`jakarta.validation.constraints`):

```java
package com.example.futmanager.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartaFUTDTO {
    private Long id;

    @NotNull(message = "El rating es obligatorio")
    @Min(value = 1, message = "El rating mínimo es 1")
    @Max(value = 99, message = "El rating máximo es 99")
    private Integer rating;

    @Min(1) @Max(99)
    private Integer ritmo;

    @Min(1) @Max(99)
    private Integer tiro;

    // Resto de atributos...
}
```

En el controlador, simplemente añadimos la anotación `@Valid` al cuerpo de la petición para delegar la validación al framework antes de que llegue a la base de datos:

```java
@PostMapping
public ResponseEntity<CartaFUTDTO> create(@Valid @RequestBody CartaFUTDTO cartaFUTDTO) {
    return ResponseEntity.status(HttpStatus.CREATED).body(cartaFUTService.save(cartaFUTDTO));
}
```
Esto desacopla por completo la validación estructural del DTO, simplifica la lógica del servicio y permite capturar y formatear los errores de validación automáticamente a través del controlador de excepciones centralizado.
