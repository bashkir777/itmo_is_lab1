package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findOrdenById(Long id);
}
