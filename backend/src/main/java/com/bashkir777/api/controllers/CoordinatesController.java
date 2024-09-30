package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.PaginatedCoordinatesDTO;
import com.bashkir777.api.services.CoordinatesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/coordinates")
@RequiredArgsConstructor
public class CoordinatesController {

    private final CoordinatesService coordinatesService;

    @GetMapping
    public ResponseEntity<PaginatedCoordinatesDTO> getAllCoordinates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(coordinatesService.getPageOfCoordinates(page, size));
    }
    
}