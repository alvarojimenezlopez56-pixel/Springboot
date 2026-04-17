package com.DAM.DAM1.Repositorio;

import com.DAM.DAM1.Dominio.Pelicula;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository

public class PeliculaRepository {

    private List<Pelicula> peliculas = new ArrayList<>();

    public PeliculaRepository() {

        peliculas.add(new Pelicula(1L, "Pelicula1", "Categoria1", 2014));
        peliculas.add(new Pelicula(2L, "Pelicula2", "Categoria2", 2015));
        peliculas.add(new Pelicula(3L, "Pelicula3", "Categoria3", 2016));
    }

    public List<Pelicula> listarPeliculas(){
        return peliculas;
    }

    public Pelicula addPelicula(Pelicula pelicula){
        peliculas.add(pelicula);
        return pelicula;
    }
}
