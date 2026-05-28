package com.example.futmanager.service;

import com.example.futmanager.dto.CartaFUTDTO;
import com.example.futmanager.mapper.CartaFUTMapper;
import com.example.futmanager.model.CartaFUT;
import com.example.futmanager.model.Jugador;
import com.example.futmanager.model.TipoCarta;
import com.example.futmanager.repository.CartaFUTRepository;
import com.example.futmanager.repository.JugadorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartaFUTServiceTest {

    @Mock
    private CartaFUTRepository cartaFUTRepository;

    @Mock
    private JugadorRepository jugadorRepository;

    @Mock
    private CartaFUTMapper cartaFUTMapper;

    @InjectMocks
    private CartaFUTService cartaFUTService;

    @Test
    public void testSaveCartaFUT_ValidStats_ShouldSucceed() {
        CartaFUTDTO dto = CartaFUTDTO.builder()
                .rating(85)
                .ritmo(80)
                .tiro(85)
                .pase(78)
                .regate(88)
                .defensa(50)
                .fisico(72)
                .tipoCarta(TipoCarta.ORO)
                .jugadorId(1L)
                .build();

        Jugador jugador = Jugador.builder().id(1L).nombre("Lionel Messi").build();
        CartaFUT entity = CartaFUT.builder().rating(85).build();

        when(jugadorRepository.findById(1L)).thenReturn(Optional.of(jugador));
        when(cartaFUTMapper.toEntity(dto)).thenReturn(entity);
        when(cartaFUTRepository.save(any(CartaFUT.class))).thenReturn(entity);
        when(cartaFUTMapper.toDto(entity)).thenReturn(dto);

        CartaFUTDTO result = cartaFUTService.save(dto);

        assertNotNull(result);
        assertEquals(85, result.getRating());
        verify(cartaFUTRepository, times(1)).save(any(CartaFUT.class));
    }

    @Test
    public void testSaveCartaFUT_InvalidStats_ShouldThrowException() {
        CartaFUTDTO dto = CartaFUTDTO.builder()
                .rating(105) // Invalid rating (>99)
                .ritmo(80)
                .tiro(85)
                .pase(78)
                .regate(88)
                .defensa(50)
                .fisico(72)
                .tipoCarta(TipoCarta.ORO)
                .jugadorId(1L)
                .build();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartaFUTService.save(dto);
        });

        assertEquals("Las estadísticas de la carta FUT deben estar entre 1 y 99.", exception.getMessage());
        verify(cartaFUTRepository, never()).save(any(CartaFUT.class));
    }
}
