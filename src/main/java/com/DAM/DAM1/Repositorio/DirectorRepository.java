package com.DAM.DAM1.Repositorio;

import com.DAM.DAM1.Dominio.Director;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class DirectorRepository {

    private List<Director> directores = new ArrayList<>();

    public DirectorRepository() {
        directores.add(new Director(1L, "Director 1", 45));
        directores.add(new Director(2L, "Director 2", 53));
        directores.add(new Director(3L, "Director 3", 38));
    }

    public List<Director> listarDirectores() {
        return directores;
    }

    public Director addDirector(Director director) {
        directores.add(director);
        return director;
    }
}
