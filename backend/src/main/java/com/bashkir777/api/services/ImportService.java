package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.ImportOperation;
import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.data.repositories.ImportRepository;
import com.bashkir777.api.dto.ImportDTO;
import com.bashkir777.api.dto.ListMarinesDto;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.services.enums.ImportStatus;
import com.bashkir777.api.services.enums.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class ImportService {
    private final SpaceMarineService spaceMarineService;
    private final ImportRepository importRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ResponseEntity<OperationInfo> importMarines(MultipartFile file) {
        var errorEntity = ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new OperationInfo(false, "Error appeared while importing space marines"));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new OperationInfo(false, "File is empty"));
        }
        if(!Objects.equals(file.getContentType(), "application/json")){
            return ResponseEntity.badRequest().body(new OperationInfo(false, "File should have json type"));
        }

        String username = userService.getCurrentUserUsername();
        User creator = userService.getUserByUsername(username).orElseThrow();

        try {
            String fileContent = new String(file.getBytes());

            ListMarinesDto listMarinesDto = objectMapper.readValue(fileContent, ListMarinesDto.class);

            if (listMarinesDto.getListMarines().isEmpty()) {
                return ResponseEntity.badRequest().body(new OperationInfo(false, "File contains no space marines"));
            }

            for (SpaceMarineDTO dto : listMarinesDto.getListMarines()) {
                spaceMarineService.createSpaceMarine(dto);
            }

            createImportOperation(
                    ImportOperation.builder()
                            .creator(creator)
                            .status(ImportStatus.SUCCESS)
                            .counter(listMarinesDto.getListMarines().size())
                            .build()
            );

            return ResponseEntity.ok(new OperationInfo(true, "Space marines successfully imported"));
        } catch (IOException e) {
            createImportOperation(
                    ImportOperation.builder()
                            .creator(creator)
                            .status(ImportStatus.ERROR)
                            .counter(null)
                            .build()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OperationInfo(false, "Error reading file: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            createImportOperation(
                    ImportOperation.builder()
                            .creator(creator)
                            .status(ImportStatus.ERROR)
                            .counter(null)
                            .build()
            );
            return errorEntity;
        }
    }

    public void createImportOperation(ImportOperation importOperation) {
        importRepository.save(importOperation);
    }

    public List<ImportDTO> getAllImports() {
        String username = userService.getCurrentUserUsername();
        User user = userService.getUserByUsername(username).orElseThrow();

        if (user.getRole().equals(Role.ADMIN)) {
            return importRepository.findAll().stream().map(ImportOperation::toDTO).toList();
        } else {
            return user.getImportOperations().stream().map(ImportOperation::toDTO).toList();
        }
    }
}
