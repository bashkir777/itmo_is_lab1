package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.SpaceMarine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpaceMarineRepository extends JpaRepository<SpaceMarine, Long> {
    Page<SpaceMarine> findByOrdenId(Long ordenId, Pageable pageable);
    Page<SpaceMarine> findByOrdenIsNull(Pageable pageable);
    Optional<SpaceMarine> findFirstByOrderByCreationDateDesc();
    @Query("SELECT sm FROM SpaceMarine sm WHERE LOWER(sm.name) LIKE LOWER(CONCAT(:prefix, '%'))")
    List<SpaceMarine> findByNameStartingWithIgnoreCase(@Param("prefix") String prefix);
}
