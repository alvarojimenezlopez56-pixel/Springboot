package com.example.futmanager.service;

import com.example.futmanager.dto.EquipoDTO;
import com.example.futmanager.mapper.EquipoMapper;
import com.example.futmanager.model.Equipo;
import com.example.futmanager.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final EquipoMapper equipoMapper;

    @Transactional(readOnly = true)
    public List<EquipoDTO> findAll() {
        return equipoRepository.findAll().stream()
                .map(equipoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EquipoDTO findById(Long id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        return equipoMapper.toDto(equipo);
    }

    @Transactional
    public EquipoDTO save(EquipoDTO equipoDTO) {
        Equipo equipo = equipoMapper.toEntity(equipoDTO);
        Equipo saved = equipoRepository.save(equipo);
        return equipoMapper.toDto(saved);
    }

    @Transactional
    public EquipoDTO update(Long id, EquipoDTO equipoDTO) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        equipo.setNombre(equipoDTO.getNombre());
        equipo.setLiga(equipoDTO.getLiga());
        equipo.setPais(equipoDTO.getPais());
        equipo.setEscudoUrl(equipoDTO.getEscudoUrl());
        Equipo updated = equipoRepository.save(equipo);
        return equipoMapper.toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        Equipo equipo = equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        equipoRepository.delete(equipo);
    }
}
