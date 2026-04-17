package com.DAM.DAM1.Controlador;

import com.DAM.DAM1.Dominio.Pelicula;
import com.DAM.DAM1.Servicio.PeliculaServicio;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/peliculas")
@AllArgsConstructor

public class PeliculaController {

    private final PeliculaServicio servicio;

    @GetMapping
    public List<Pelicula> listar() {
        return servicio.obtenerTodas();
    }

    @PostMapping
    public Pelicula guardar(@RequestBody Pelicula pelicula) {
        return servicio.guardar(pelicula);
    }
}