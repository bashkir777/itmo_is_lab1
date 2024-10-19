package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.repositories.CoordinatesRepository;
import com.bashkir777.api.dto.CoordinatesDTO;
import com.bashkir777.api.dto.PaginatedCoordinatesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoordinatesService {

    private final CoordinatesRepository coordinatesRepository;

    public PaginatedCoordinatesDTO getPageOfCoordinates(int page, int size) {
        List<Coordinates> coordinatesList = coordinatesRepository.findAll(page, size);
        List<CoordinatesDTO> coordinatesDTOs = coordinatesList.stream()
                .map(Coordinates::toDTO)
                .collect(Collectors.toList());

        long totalElements = coordinatesRepository.countAll();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PaginatedCoordinatesDTO.builder()
                .content(coordinatesDTOs)
                .totalPages(totalPages)
                .build();
    }
}