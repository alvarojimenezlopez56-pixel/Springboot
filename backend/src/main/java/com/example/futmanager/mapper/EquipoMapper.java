package com.example.futmanager.mapper;

import com.example.futmanager.dto.EquipoDTO;
import com.example.futmanager.model.Equipo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EquipoMapper {
    EquipoDTO toDto(Equipo equipo);
    Equipo toEntity(EquipoDTO equipoDTO);
}
