package com.example.futmanager.mapper;

import com.example.futmanager.dto.CartaFUTDTO;
import com.example.futmanager.model.CartaFUT;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartaFUTMapper {

    @Mapping(source = "jugador.id", target = "jugadorId")
    @Mapping(source = "jugador.nombre", target = "jugadorNombre")
    CartaFUTDTO toDto(CartaFUT cartaFUT);

    @Mapping(source = "jugadorId", target = "jugador.id")
    CartaFUT toEntity(CartaFUTDTO cartaFUTDTO);
}
