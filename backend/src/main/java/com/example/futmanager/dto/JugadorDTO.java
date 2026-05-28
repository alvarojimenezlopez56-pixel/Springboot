package com.example.futmanager.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JugadorDTO {
    private Long id;
    private String nombre;
    private String nacionalidad;
    private String posicion;
    private String fotoUrl;
    private Long equipoId;
    private String equipoNombre;
}
