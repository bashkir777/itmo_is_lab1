package com.bashkir777.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMarineToOrdenDTO {
    private long spaceMarineId;
    private long ordenId;
}
