package com.DAM.DAM1.Controlador;

import com.DAM.DAM1.Dominio.Actor;
import com.DAM.DAM1.Servicio.ActorService;
import lombok.AllArgsConstructor;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/actor")
@AllArgsConstructor

public class ActorController {

    private final ActorService servicio;

    @GetMapping
    public List<Actor> listar() {
        return servicio.obtenerTodos();
    }

    @PostMapping
    public Actor guardar(@RequestBody Actor actor) {
        return servicio.guardar(actor);
    }
}
