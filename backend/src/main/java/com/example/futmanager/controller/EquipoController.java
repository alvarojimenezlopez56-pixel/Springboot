package com.example.futmanager.controller;

import com.example.futmanager.dto.EquipoDTO;
import com.example.futmanager.service.EquipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    @GetMapping
    public ResponseEntity<List<EquipoDTO>> getAll() {
        return ResponseEntity.ok(equipoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<EquipoDTO> create(@RequestBody EquipoDTO equipoDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipoService.save(equipoDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipoDTO> update(@PathVariable Long id, @RequestBody EquipoDTO equipoDTO) {
        return ResponseEntity.ok(equipoService.update(id, equipoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        equipoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
