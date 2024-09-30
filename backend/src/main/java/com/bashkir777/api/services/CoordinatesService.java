package com.bashkir777.api.services;

import com.bashkir777.api.data.repositories.CoordinatesRepository;
import com.bashkir777.api.dto.CoordinatesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CoordinatesService {
    private final CoordinatesRepository coordinatesRepository;

    public List<CoordinatesDTO> getAllCoordinates() {
        return coordinatesRepository.findAll().stream().
                map(coordinates -> CoordinatesDTO.builder().
                        id(coordinates.getId()).
                        x(coordinates.getX()).
                        y(coordinates.getY()).build()).
                toList();
    }

}
