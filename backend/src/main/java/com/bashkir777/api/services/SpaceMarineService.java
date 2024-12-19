package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.*;
import com.bashkir777.api.data.enums.Weapon;
import com.bashkir777.api.data.repositories.ChapterRepository;
import com.bashkir777.api.data.repositories.CoordinatesRepository;
import com.bashkir777.api.data.repositories.SpaceMarineRepository;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.PaginatedSpaceMarineDTO;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.services.enums.Role;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceMarineService {

    private final SpaceMarineRepository spaceMarineRepository;
    private final ChapterRepository chapterRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final UpdatedService updatedService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    private void linkCoordinatesAndChapter(@NonNull SpaceMarine existingSpaceMarine, SpaceMarineDTO dto) throws IllegalArgumentException{
        if (dto.getExistingCoordinateId() != null) {
            Coordinates existingCoordinates = coordinatesRepository.findById(dto.getExistingCoordinateId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing coordinate ID"));
            existingSpaceMarine.setCoordinates(existingCoordinates);
        }else {
            var coordinates = Coordinates.builder().
                    x(dto.getX()).y(dto.getY()).build();
            coordinatesRepository.save(coordinates);
            existingSpaceMarine.setCoordinates(coordinates);
        }

        if (dto.getExistingChapterId() != null) {
            Chapter existingChapter = chapterRepository.findById(dto.getExistingChapterId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing chapter ID"));
            existingSpaceMarine.setChapter(existingChapter);
        }else{
            var chapter = Chapter.builder().
                    world(dto.getChapterWorld()).
                    name(dto.getChapterName()).build();
            chapterRepository.save(chapter);
            existingSpaceMarine.setChapter(chapter);
        }
    }

    public OperationInfo createSpaceMarine(SpaceMarineDTO dto) {
        SpaceMarine spaceMarine = dto.toEntity();

        linkCoordinatesAndChapter(spaceMarine, dto);

        User currentUser = getCurrentUser();
        spaceMarine.setCreatedBy(currentUser);

        spaceMarineRepository.save(spaceMarine);
        return new OperationInfo(true, "Space Marine successfully created");
    }

    public PaginatedSpaceMarineDTO getAllSpaceMarines(int page, int size) {
        List<SpaceMarine> spaceMarines = spaceMarineRepository.findAll(page, size);
        List<SpaceMarineDTO> spaceMarineDTOs = spaceMarines.stream()
                .map(SpaceMarine::toDTO)
                .collect(Collectors.toList());

        long totalElements = spaceMarineRepository.countAll();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedSpaceMarineDTO.builder()
                .content(spaceMarineDTOs)
                .totalPages(totalPages)
                .build();
    }

    public PaginatedSpaceMarineDTO getSpaceMarinesByOrdenId(Long ordenId, int page, int size) {
        List<SpaceMarine> spaceMarines = spaceMarineRepository.findByOrdenId(ordenId, page, size);
        List<SpaceMarineDTO> spaceMarineDTOs = spaceMarines.stream()
                .map(SpaceMarine::toDTO)
                .collect(Collectors.toList());

        long totalElements = spaceMarineRepository.countByOrdenId(ordenId);
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedSpaceMarineDTO.builder()
                .content(spaceMarineDTOs)
                .totalPages(totalPages)
                .build();
    }

    public SpaceMarine getSpaceMarineById(long id) throws RuntimeException {
        return spaceMarineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SpaceMarine not found"));
    }

    public OperationInfo deleteSpaceMarine(long id) throws RuntimeException {
        SpaceMarine spaceMarine = spaceMarineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SpaceMarine not found"));

        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.ADMIN || currentUser.getId().equals(spaceMarine.getCreatedBy().getId())) {
            spaceMarineRepository.delete(spaceMarine);
            return new OperationInfo(true, "Space Marine successfully deleted");
        } else {
            throw new RuntimeException("You do not have permission to delete this SpaceMarine");
        }
    }

    public OperationInfo addMarineToOrden(SpaceMarine spaceMarine, Orden orden) {
        spaceMarine.setOrden(orden);
        spaceMarineRepository.save(spaceMarine);
        return new OperationInfo(true, "Space Marine successfully added to orden");
    }

    public OperationInfo removeMarineFromOrden(SpaceMarine spaceMarine) {
        spaceMarine.setOrden(null);
        spaceMarineRepository.save(spaceMarine);
        return new OperationInfo(true, "Space Marine successfully removed from orden");
    }

    public OperationInfo patchSpaceMarine(@Valid SpaceMarineDTO dto) {
        assert dto.getId() != null;
        SpaceMarine existingSpaceMarine = spaceMarineRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("SpaceMarine not found"));

        existingSpaceMarine.setName(dto.getName());
        existingSpaceMarine.setHealth(dto.getHealth());
        existingSpaceMarine.setCategory(dto.getCategory());
        existingSpaceMarine.setWeaponType(dto.getWeaponType());
        existingSpaceMarine.setMeleeWeapon(dto.getMeleeWeapon());

        linkCoordinatesAndChapter(existingSpaceMarine, dto);

        spaceMarineRepository.save(existingSpaceMarine);
        updatedService.createRecord(getCurrentUser(), existingSpaceMarine);
        return new OperationInfo(true, "Space Marine successfully updated");
    }

    public PaginatedSpaceMarineDTO getSpaceMarinesWithoutOrden(int page, int size) {
        List<SpaceMarine> spaceMarines = spaceMarineRepository.findByOrdenIsNull(page, size);
        List<SpaceMarineDTO> spaceMarineDTOs = spaceMarines.stream()
                .map(SpaceMarine::toDTO)
                .collect(Collectors.toList());

        long totalElements = spaceMarineRepository.countByOrdenIsNull();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedSpaceMarineDTO.builder()
                .content(spaceMarineDTOs)
                .totalPages(totalPages)
                .build();
    }

    public Optional<SpaceMarine> getMostRecentlyCreatedSpaceMarine() {
        return spaceMarineRepository.findFirstByOrderByCreationDateDesc();
    }

    public List<SpaceMarine> findByNameStartingWith(String prefix) {
        return spaceMarineRepository.findByNameStartingWithIgnoreCase(prefix);
    }

    public List<SpaceMarine> findByWeaponTypeLessThan(Weapon weapon) {
        return spaceMarineRepository.findByWeaponTypeLessThan(weapon);
    }
}