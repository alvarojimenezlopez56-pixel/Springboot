package com.example.futmanager.service;

import com.example.futmanager.dto.CartaFUTDTO;
import com.example.futmanager.mapper.CartaFUTMapper;
import com.example.futmanager.model.CartaFUT;
import com.example.futmanager.model.Jugador;
import com.example.futmanager.repository.CartaFUTRepository;
import com.example.futmanager.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartaFUTService {

    private final CartaFUTRepository cartaFUTRepository;
    private final JugadorRepository jugadorRepository;
    private final CartaFUTMapper cartaFUTMapper;

    @Transactional(readOnly = true)
    public List<CartaFUTDTO> findAll() {
        return cartaFUTRepository.findAll().stream()
                .map(cartaFUTMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CartaFUTDTO findById(Long id) {
        CartaFUT carta = cartaFUTRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carta FUT no encontrada con ID: " + id));
        return cartaFUTMapper.toDto(carta);
    }

    @Transactional
    public CartaFUTDTO save(CartaFUTDTO dto) {
        validateStats(dto);
        CartaFUT carta = cartaFUTMapper.toEntity(dto);
        
        if (dto.getJugadorId() == null) {
            throw new RuntimeException("La carta FUT debe estar asociada a un jugador");
        }
        
        Jugador jugador = jugadorRepository.findById(dto.getJugadorId())
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + dto.getJugadorId()));
        carta.setJugador(jugador);
        
        CartaFUT saved = cartaFUTRepository.save(carta);
        return cartaFUTMapper.toDto(saved);
    }

    @Transactional
    public CartaFUTDTO update(Long id, CartaFUTDTO dto) {
        validateStats(dto);
        CartaFUT carta = cartaFUTRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carta FUT no encontrada con ID: " + id));
        
        carta.setRating(dto.getRating());
        carta.setRitmo(dto.getRitmo());
        carta.setTiro(dto.getTiro());
        carta.setPase(dto.getPase());
        carta.setRegate(dto.getRegate());
        carta.setDefensa(dto.getDefensa());
        carta.setFisico(dto.getFisico());
        carta.setTipoCarta(dto.getTipoCarta());

        if (dto.getJugadorId() != null) {
            Jugador jugador = jugadorRepository.findById(dto.getJugadorId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + dto.getJugadorId()));
            carta.setJugador(jugador);
        }

        CartaFUT updated = cartaFUTRepository.save(carta);
        return cartaFUTMapper.toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        CartaFUT carta = cartaFUTRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carta FUT no encontrada con ID: " + id));
        cartaFUTRepository.delete(carta);
    }

    private void validateStats(CartaFUTDTO dto) {
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 99 ||
            dto.getRitmo() == null || dto.getRitmo() < 1 || dto.getRitmo() > 99 ||
            dto.getTiro() == null || dto.getTiro() < 1 || dto.getTiro() > 99 ||
            dto.getPase() == null || dto.getPase() < 1 || dto.getPase() > 99 ||
            dto.getRegate() == null || dto.getRegate() < 1 || dto.getRegate() > 99 ||
            dto.getDefensa() == null || dto.getDefensa() < 1 || dto.getDefensa() > 99 ||
            dto.getFisico() == null || dto.getFisico() < 1 || dto.getFisico() > 99) {
            throw new IllegalArgumentException("Las estadísticas de la carta FUT deben estar entre 1 y 99.");
        }
    }
}
