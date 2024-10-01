package com.bashkir777.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginatedSpaceMarineDTO {
    private List<SpaceMarineDTO> content;
    private int totalPages;
}