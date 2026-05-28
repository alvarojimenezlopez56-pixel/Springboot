package com.example.futmanager.controller;

import com.example.futmanager.dto.JugadorDTO;
import com.example.futmanager.service.JugadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JugadorController {

    private final JugadorService jugadorService;

    @GetMapping
    public ResponseEntity<List<JugadorDTO>> getAll() {
        return ResponseEntity.ok(jugadorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JugadorDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jugadorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<JugadorDTO> create(@RequestBody JugadorDTO jugadorDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jugadorService.save(jugadorDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JugadorDTO> update(@PathVariable Long id, @RequestBody JugadorDTO jugadorDTO) {
        return ResponseEntity.ok(jugadorService.update(id, jugadorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jugadorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
