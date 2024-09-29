package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinatesRepository extends JpaRepository<Coordinates, Long> {
}
