package com.example.futmanager.controller;

import com.example.futmanager.dto.CartaFUTDTO;
import com.example.futmanager.service.CartaFUTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartaFUTController {

    private final CartaFUTService cartaFUTService;

    @GetMapping
    public ResponseEntity<List<CartaFUTDTO>> getAll() {
        return ResponseEntity.ok(cartaFUTService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartaFUTDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cartaFUTService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CartaFUTDTO> create(@RequestBody CartaFUTDTO cartaFUTDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartaFUTService.save(cartaFUTDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartaFUTDTO> update(@PathVariable Long id, @RequestBody CartaFUTDTO cartaFUTDTO) {
        return ResponseEntity.ok(cartaFUTService.update(id, cartaFUTDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cartaFUTService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
