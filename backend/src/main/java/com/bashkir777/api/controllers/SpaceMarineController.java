package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.services.SpaceMarineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/space-marines")
@RequiredArgsConstructor
public class SpaceMarineController {

    private final SpaceMarineService spaceMarineService;

    @PostMapping
    public ResponseEntity<OperationInfo> createSpaceMarine(@RequestBody @Valid SpaceMarineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).
                body(spaceMarineService.createSpaceMarine(dto));
    }


    @ExceptionHandler({RuntimeException.class})
    private ResponseEntity<OperationInfo> badCredentials(RuntimeException exception) {
        exception.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(OperationInfo.builder().success(false)
                        .message(exception.getMessage()).build());
    }
}