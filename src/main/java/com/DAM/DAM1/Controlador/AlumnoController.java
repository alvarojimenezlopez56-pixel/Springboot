package com.DAM.DAM1.Controlador;

import com.DAM.DAM1.Dominio.Alumnos;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Indica que esta clase manejará peticiones HTTP y devolverá datos (JSON)
public class AlumnoController {

    @GetMapping("/mostrar-alumno") // Esta será la URL específica
    public Alumnos mostrarAlumno() {
        // Instanciamos la clase Alumnos con datos de ejemplo
        Alumnos miAlumno = new Alumnos("Alvaro", "Jiménez", 18);

        // Al devolver el objeto, Spring lo convierte automáticamente a formato JSON
        return miAlumno;
    }
}