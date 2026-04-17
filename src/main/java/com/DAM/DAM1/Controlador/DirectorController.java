package com.DAM.DAM1.Controlador;

import com.DAM.DAM1.Dominio.Director;
import com.DAM.DAM1.Servicio.DirectorService;
import lombok.AllArgsConstructor;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/director")
@AllArgsConstructor

public class DirectorController {

    private final DirectorService servicio;

    @GetMapping
    public List<Director> listar() {
        return servicio.obtenerTodos();
    }

    @PostMapping
    public Director guardar(@RequestBody Director director) {
        return servicio.guardar(director);
    }
}
