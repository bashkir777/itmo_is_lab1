package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.ChapterDTO;
import com.bashkir777.api.services.ChaptersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/api/v1/chapters")
@RequiredArgsConstructor
public class ChaptersController {

    private final ChaptersService chaptersService;

    @GetMapping
    public ResponseEntity<List<ChapterDTO>> getAllChapters() {
        return ResponseEntity.ok(chaptersService.getAllChapters());
    }

}
