package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.ApplicationDTO;
import com.bashkir777.api.dto.IdDTO;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.services.AdminApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin-applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ManagementController {

    private final AdminApplicationService adminApplicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationDTO>> getAllUnconsideredApplications() {
        return ResponseEntity.ok(adminApplicationService.getAdminUnconsideredApplications());
    }

    @PostMapping("/accept")
    public ResponseEntity<OperationInfo> acceptApplication(@RequestBody IdDTO idDTO) {
        return ResponseEntity.ok(adminApplicationService.acceptApplication(idDTO.getId()));
    }

    @PostMapping("/reject")
    public ResponseEntity<OperationInfo> rejectApplication(@RequestBody IdDTO idDTO) {
        return ResponseEntity.ok(adminApplicationService.rejectApplication(idDTO.getId()));
    }

    @ExceptionHandler({RuntimeException.class})
    private ResponseEntity<OperationInfo> badCredentials(RuntimeException exception) {
        exception.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(OperationInfo.builder().success(false)
                        .message(exception.getMessage()).build());
    }

}
