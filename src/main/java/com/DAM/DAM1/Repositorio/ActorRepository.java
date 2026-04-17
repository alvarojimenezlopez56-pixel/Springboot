package com.DAM.DAM1.Repositorio;

import com.DAM.DAM1.Dominio.Actor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ActorRepository {

    private List<Actor> actores = new ArrayList<>();

    public ActorRepository() {
        actores.add(new Actor(1L, "Actor 1", "Francesa"));
        actores.add(new Actor(2L, "Actor 2", "Mexicana"));
        actores.add(new Actor(3L, "Actor 3", "Alemana"));
    }

    public List<Actor> listarActores() {
        return actores;
    }

    public Actor addActor(Actor actor) {
        actores.add(actor);
        return actor;
    }
}
