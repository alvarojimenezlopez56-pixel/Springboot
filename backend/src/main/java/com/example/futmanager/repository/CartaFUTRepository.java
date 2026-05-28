package com.example.futmanager.repository;

import com.example.futmanager.model.CartaFUT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartaFUTRepository extends JpaRepository<CartaFUT, Long> {
}
