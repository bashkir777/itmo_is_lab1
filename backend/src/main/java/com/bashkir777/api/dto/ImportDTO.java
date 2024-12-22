package com.bashkir777.api.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportDTO {
    private int id;
    private String status;
    private String creatorName;
    @Nullable
    private Integer counter;
    @Nullable
    private String link;
}
