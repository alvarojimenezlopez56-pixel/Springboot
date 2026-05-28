package com.example.futmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cartas_fut")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartaFUT {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer rating;

    // Estadísticas
    private Integer ritmo;
    private Integer tiro;
    private Integer pase;
    private Integer regate;
    private Integer defensa;
    private Integer fisico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCarta tipoCarta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;
}
