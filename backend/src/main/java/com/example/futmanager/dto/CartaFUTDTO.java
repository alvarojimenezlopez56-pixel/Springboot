package com.example.futmanager.dto;

import com.example.futmanager.model.TipoCarta;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartaFUTDTO {
    private Long id;
    private Integer rating;
    private Integer ritmo;
    private Integer tiro;
    private Integer pase;
    private Integer regate;
    private Integer defensa;
    private Integer fisico;
    private TipoCarta tipoCarta;
    private Long jugadorId;
    private String jugadorNombre;
}
