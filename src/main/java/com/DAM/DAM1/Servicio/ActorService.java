package com.DAM.DAM1.Servicio;

import com.DAM.DAM1.Dominio.Actor;
import com.DAM.DAM1.Repositorio.ActorRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class ActorService {

    private final ActorRepository repository;

    public List<Actor> obtenerTodos() {
        return repository.listarActores();
    }

    public Actor guardar(Actor actor) {
        return repository.addActor(actor);
    }
}
