package com.DAM.DAM1.Servicio;

import com.DAM.DAM1.Dominio.Pelicula;
import com.DAM.DAM1.Repositorio.PeliculaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class PeliculaServicio {

    private final PeliculaRepository repository;

    public List<Pelicula> obtenerTodas() {
        return repository.listarPeliculas();
    }

    public Pelicula guardar(Pelicula pelicula) {
        return repository.addPelicula(pelicula);
    }
}
