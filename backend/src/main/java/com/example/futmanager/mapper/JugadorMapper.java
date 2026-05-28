package com.example.futmanager.mapper;

import com.example.futmanager.dto.JugadorDTO;
import com.example.futmanager.model.Jugador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JugadorMapper {

    @Mapping(source = "equipo.id", target = "equipoId")
    @Mapping(source = "equipo.nombre", target = "equipoNombre")
    JugadorDTO toDto(Jugador jugador);

    @Mapping(source = "equipoId", target = "equipo.id")
    Jugador toEntity(JugadorDTO jugadorDTO);
}
