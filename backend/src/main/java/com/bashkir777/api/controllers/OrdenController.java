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

    @PostMapping
    public ResponseEntity<OperationInfo> createOrden(@RequestBody OrdenDTO ordenDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).
                body(ordenService.createOrden(ordenDTO.getTitle()));
    }

    @PatchMapping
    public ResponseEntity<OperationInfo> patchOrden(@RequestBody OrdenDTO ordenDTO) {
        return ResponseEntity.status(HttpStatus.OK).
                body(ordenService.patchOrden(ordenDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<OperationInfo> deleteOrden(@PathVariable long id) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).
                body(ordenService.deleteOrden(id));
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
