package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.SpaceMarine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceMarineRepository extends JpaRepository<SpaceMarine, Long> {
    Page<SpaceMarine> findByOrdenId(Long ordenId, Pageable pageable);
    Page<SpaceMarine> findByOrdenIsNull(Pageable pageable);
}
