package com.example.futmanager.service;

import com.example.futmanager.dto.EquipoDTO;
import com.example.futmanager.mapper.EquipoMapper;
import com.example.futmanager.model.Equipo;
import com.example.futmanager.repository.EquipoRepository;
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
public class EquipoServiceTest {

    @Mock
    private EquipoRepository equipoRepository;

    @Mock
    private EquipoMapper equipoMapper;

    @InjectMocks
    private EquipoService equipoService;

    @Test
    public void testFindById_ExistingId_ShouldReturnDto() {
        Equipo equipo = Equipo.builder().id(1L).nombre("Real Madrid").liga("LaLiga").pais("España").build();
        EquipoDTO dto = EquipoDTO.builder().id(1L).nombre("Real Madrid").liga("LaLiga").pais("España").build();

        when(equipoRepository.findById(1L)).thenReturn(Optional.of(equipo));
        when(equipoMapper.toDto(equipo)).thenReturn(dto);

        EquipoDTO result = equipoService.findById(1L);

        assertNotNull(result);
        assertEquals("Real Madrid", result.getNombre());
        verify(equipoRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindById_NonExistingId_ShouldThrowException() {
        when(equipoRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            equipoService.findById(999L);
        });

        assertEquals("Equipo no encontrado con ID: 999", exception.getMessage());
        verify(equipoRepository, times(1)).findById(999L);
    }
}
