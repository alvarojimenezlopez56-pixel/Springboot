package com.DAM.DAM1.Servicio;

import com.DAM.DAM1.Dominio.Director;
import com.DAM.DAM1.Repositorio.DirectorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class DirectorService {

    private final DirectorRepository repository;

    public List<Director> obtenerTodos() {
        return repository.listarDirectores();
    }

    public Director guardar(Director director) {
        return repository.addDirector(director);
    }
}
