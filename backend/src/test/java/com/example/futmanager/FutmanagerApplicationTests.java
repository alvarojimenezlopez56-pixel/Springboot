package com.example.futmanager;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Deshabilitado para evitar dependencia de base de datos activa durante pruebas de carga de contexto")
class FutmanagerApplicationTests {

	@Test
	void contextLoads() {
	}

}

