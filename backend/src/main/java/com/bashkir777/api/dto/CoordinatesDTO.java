package com.bashkir777.api.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoordinatesDTO {

    private long id;

    private long x;

    @Min(value = -954, message = "Y must be greater than -954")
    private double y;

}
