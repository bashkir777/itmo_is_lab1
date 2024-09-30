package com.bashkir777.api.data.entities;

import com.bashkir777.api.dto.CoordinatesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coordinates")
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private long x;

    @Min(value = -954, message = "Y must be greater than -954")
    @Column(nullable = false)
    private double y; //Значение поля должно быть больше -954

    public CoordinatesDTO toDTO() {
        return CoordinatesDTO.builder().
                id(this.getId()).
                x(this.getX()).
                y(this.getY()).build();
    }
}