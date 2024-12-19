package com.bashkir777.api.services;

import com.bashkir777.api.dto.ListMarinesDto;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.SpaceMarineDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportService {
    private final SpaceMarineService spaceMarineService;

    @Transactional
    public ResponseEntity<OperationInfo> importMarines(ListMarinesDto listMarinesDto){
        try{
            for(SpaceMarineDTO dto: listMarinesDto.getListMarines()){
                spaceMarineService.createSpaceMarine(dto);
            }
            return ResponseEntity.ok(new OperationInfo(true, "Space marines successfully imported"));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new OperationInfo(false, "Error appeared while importing space marines"));
        }
    }
}
