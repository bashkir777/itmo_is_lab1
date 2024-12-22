package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.ImportDTO;
import com.bashkir777.api.dto.ListMarinesDto;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.services.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/import")
public class ImportController {

    private final ImportService importService;

    @PostMapping
    public ResponseEntity<OperationInfo> importMarines(@RequestParam("file") MultipartFile file) {

        return importService.importMarines(file);
    }

    @GetMapping
    public ResponseEntity<List<ImportDTO>> getAllImportOperations() {
        return ResponseEntity.ok(importService.getAllImports());
    }
}
