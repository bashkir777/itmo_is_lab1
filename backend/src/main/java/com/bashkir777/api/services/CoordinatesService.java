package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.repositories.CoordinatesRepository;
import com.bashkir777.api.dto.CoordinatesDTO;
import com.bashkir777.api.dto.PaginatedCoordinatesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoordinatesService {

    private final CoordinatesRepository coordinatesRepository;

    public PaginatedCoordinatesDTO getPageOfCoordinates(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Coordinates> coordinatesPage = coordinatesRepository.findAll(pageable);
        List<CoordinatesDTO> coordinatesDTOs = coordinatesPage.getContent().stream()
                .map(Coordinates::toDTO)
                .collect(Collectors.toList());
        return PaginatedCoordinatesDTO.builder()
                .content(coordinatesDTOs)
                .totalPages(coordinatesPage.getTotalPages())
                .build();
    }

}