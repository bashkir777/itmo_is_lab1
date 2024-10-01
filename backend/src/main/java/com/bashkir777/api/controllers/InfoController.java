package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.PaginatedChapterDTO;
import com.bashkir777.api.dto.PaginatedCoordinatesDTO;
import com.bashkir777.api.dto.PaginatedSpaceMarineDTO;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.services.ChaptersService;
import com.bashkir777.api.services.CoordinatesService;
import com.bashkir777.api.services.SpaceMarineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/info")
@RequiredArgsConstructor
public class InfoController {

    private final SpaceMarineService spaceMarineService;
    private final CoordinatesService coordinatesService;
    private final ChaptersService chaptersService;

    @GetMapping("/chapters")
    public ResponseEntity<PaginatedChapterDTO> getAllChapters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(chaptersService.getAllChapters(page, size));
    }

    @GetMapping("/coordinates")
    public ResponseEntity<PaginatedCoordinatesDTO> getAllCoordinates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(coordinatesService.getPageOfCoordinates(page, size));
    }

    @GetMapping("/space-marines")
    public ResponseEntity<PaginatedSpaceMarineDTO> getAllSpaceMarines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(spaceMarineService.getAllSpaceMarines(page, size));
    }

    @GetMapping("/space-marines/{id}")
    public SpaceMarineDTO getSpaceMarineById(@PathVariable Integer id) throws RuntimeException {
        return spaceMarineService.getSpaceMarineById(id).toDTO();
    }
    
}
