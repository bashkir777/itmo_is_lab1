package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.PaginatedChapterDTO;
import com.bashkir777.api.services.ChaptersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chapters")
@RequiredArgsConstructor
public class ChaptersController {

    private final ChaptersService chaptersService;

    @GetMapping
    public ResponseEntity<PaginatedChapterDTO> getAllChapters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(chaptersService.getAllChapters(page, size));
    }
}