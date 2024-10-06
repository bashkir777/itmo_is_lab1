package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.*;
import com.bashkir777.api.services.OrdenService;
import com.bashkir777.api.services.SpaceMarineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ordens")
@RequiredArgsConstructor
public class OrdenController {
    private final OrdenService ordenService;
    private final SpaceMarineService spaceMarineService;

    @GetMapping
    public ResponseEntity<List<OrdenDTO>> getAllOrdens() {
        return ResponseEntity.ok(ordenService.getAllOrdens());
    }

    @PostMapping
    public ResponseEntity<OperationInfo> createOrden(@RequestBody OrdenDTO ordenDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).
                body(ordenService.createOrden(ordenDTO.getTitle()));
    }

    @DeleteMapping
    public ResponseEntity<OperationInfo> deleteOrden(@RequestBody IdDTO dto) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).
                body(ordenService.deleteOrden(dto.getId()));
    }

    @PostMapping("/space-marine")
    public ResponseEntity<OperationInfo> addMarineToOrden(@RequestBody AddMarineToOrdenDTO dto)
            throws IllegalArgumentException {
        var marine = spaceMarineService.getSpaceMarineById(dto.getSpaceMarineId());
        var orden = ordenService.getOrdenById(dto.getOrdenId());
        return ResponseEntity.status(HttpStatus.CREATED).
                body(spaceMarineService.addMarineToOrden(marine, orden));
    }

    @DeleteMapping("/space-marine")
    public ResponseEntity<OperationInfo> removeMarineFromOrden(@RequestBody RemoveMarineFromOrdenDTO dto)
            throws IllegalArgumentException {
        var marine = spaceMarineService.getSpaceMarineById(dto.getSpaceMarineId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).
                body(spaceMarineService.removeMarineFromOrden(marine));
    }

    @ExceptionHandler({IllegalArgumentException.class})
    private ResponseEntity<OperationInfo> illegalArgs(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(OperationInfo.builder().success(false)
                        .message(exception.getMessage()).build());
    }

}
