package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.repositories.ChapterRepository;
import com.bashkir777.api.data.repositories.CoordinatesRepository;
import com.bashkir777.api.data.repositories.SpaceMarineRepository;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.SpaceMarineDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceMarineService {

    private final SpaceMarineRepository spaceMarineRepository;
    private final ChapterRepository chapterRepository;
    private final CoordinatesRepository coordinatesRepository;

    public OperationInfo createSpaceMarine(SpaceMarineDTO dto) {
        SpaceMarine spaceMarine = dto.toEntity();

        if (dto.getExistingCoordinateId() != null) {
            Coordinates existingCoordinates = coordinatesRepository.findById(dto.getExistingCoordinateId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing coordinate ID"));
            spaceMarine.setCoordinates(existingCoordinates);
        }

        if (dto.getExistingChapterId() != null) {
            Chapter existingChapter = chapterRepository.findById(dto.getExistingChapterId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid existing chapter ID"));
            spaceMarine.setChapter(existingChapter);
        }

        spaceMarineRepository.save(spaceMarine);
        return new OperationInfo(true, "Space Marine successfully created");
    }

    public List<SpaceMarineDTO> getAllSpaceMarines() {
        return spaceMarineRepository.findAll().stream()
                .map(SpaceMarine::toDTO)
                .collect(Collectors.toList());
    }

    public SpaceMarine getSpaceMarineById(Integer id) throws RuntimeException {
        return spaceMarineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SpaceMarine not found"));
    }

}