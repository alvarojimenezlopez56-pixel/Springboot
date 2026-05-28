package com.example.futmanager.service;

import com.example.futmanager.dto.JugadorDTO;
import com.example.futmanager.mapper.JugadorMapper;
import com.example.futmanager.model.Equipo;
import com.example.futmanager.model.Jugador;
import com.example.futmanager.repository.EquipoRepository;
import com.example.futmanager.repository.JugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorMapper jugadorMapper;

    @Transactional(readOnly = true)
    public List<JugadorDTO> findAll() {
        return jugadorRepository.findAll().stream()
                .map(jugadorMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JugadorDTO findById(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));
        return jugadorMapper.toDto(jugador);
    }

    @Transactional
    public JugadorDTO save(JugadorDTO jugadorDTO) {
        Jugador jugador = jugadorMapper.toEntity(jugadorDTO);
        if (jugadorDTO.getEquipoId() != null) {
            Equipo equipo = equipoRepository.findById(jugadorDTO.getEquipoId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + jugadorDTO.getEquipoId()));
            jugador.setEquipo(equipo);
        }
        Jugador saved = jugadorRepository.save(jugador);
        return jugadorMapper.toDto(saved);
    }

    @Transactional
    public JugadorDTO update(Long id, JugadorDTO jugadorDTO) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));
        
        jugador.setNombre(jugadorDTO.getNombre());
        jugador.setNacionalidad(jugadorDTO.getNacionalidad());
        jugador.setPosicion(jugadorDTO.getPosicion());
        jugador.setFotoUrl(jugadorDTO.getFotoUrl());

        if (jugadorDTO.getEquipoId() != null) {
            Equipo equipo = equipoRepository.findById(jugadorDTO.getEquipoId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + jugadorDTO.getEquipoId()));
            jugador.setEquipo(equipo);
        } else {
            jugador.setEquipo(null);
        }

        Jugador updated = jugadorRepository.save(jugador);
        return jugadorMapper.toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        Jugador jugador = jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));
        jugadorRepository.delete(jugador);
    }
}
