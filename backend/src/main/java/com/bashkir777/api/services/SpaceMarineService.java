package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.entities.User;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceMarineService {

    private final SpaceMarineRepository spaceMarineRepository;
    private final ChapterRepository chapterRepository;
    private final CoordinatesRepository coordinatesRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    private void linkCoordinatesAndChapter(@NonNull SpaceMarine existingSpaceMarine, SpaceMarineDTO dto){
        if (dto.getExistingCoordinateId() != null) {
            Coordinates existingCoordinates = coordinatesRepository.findById(dto.getExistingCoordinateId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing coordinate ID"));
            existingSpaceMarine.setCoordinates(existingCoordinates);
        }

        if (dto.getExistingChapterId() != null) {
            Chapter existingChapter = chapterRepository.findById(dto.getExistingChapterId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing chapter ID"));
            existingSpaceMarine.setChapter(existingChapter);
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
        Pageable pageable = PageRequest.of(page, size);
        Page<SpaceMarine> spaceMarinePage = spaceMarineRepository.findAll(pageable);
        List<SpaceMarineDTO> spaceMarineDTOs = spaceMarinePage.getContent().stream()
                .map(SpaceMarine::toDTO)
                .collect(Collectors.toList());
        return PaginatedSpaceMarineDTO.builder()
                .content(spaceMarineDTOs)
                .totalPages(spaceMarinePage.getTotalPages())
                .build();
    }

    public SpaceMarine getSpaceMarineById(Integer id) throws RuntimeException {
        return spaceMarineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SpaceMarine not found"));
    }

    public OperationInfo deleteSpaceMarine(int id) throws RuntimeException{

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

        if(dto.getExistingCoordinateId() == null) {
            assert dto.getX() != null;
            assert dto.getY() != null;
            Coordinates coordinates = new Coordinates();
            coordinates.setX(dto.getX());
            coordinates.setY(dto.getY());
            existingSpaceMarine.setCoordinates(coordinates);
        }
        
        if(dto.getExistingChapterId() == null) {
            assert dto.getChapterWorld() != null;
            assert dto.getChapterName() != null;
            Chapter chapter = new Chapter();
            chapter.setName(dto.getChapterName());
            chapter.setWorld(dto.getChapterWorld());
            existingSpaceMarine.setChapter(chapter);
        }

        spaceMarineRepository.save(existingSpaceMarine);

        return new OperationInfo(true, "Space Marine successfully updated");
    }
}