package com.bashkir777.api.data.entities;

import com.bashkir777.api.data.enums.AstartesCategory;
import com.bashkir777.api.data.enums.MeleeWeapon;
import com.bashkir777.api.data.enums.Weapon;
import com.bashkir777.api.dto.SpaceMarineDTO;
import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = "space_marines")
public class SpaceMarine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Integer id; //Поле не может быть null, Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически

    @NotBlank(message = "Name cannot be blank")
    @Column(nullable = false)
    private String name; //Поле не может быть null, Строка не может быть пустой

    @NotNull(message = "Coordinates cannot be null")
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "coordinates_id", referencedColumnName = "id", nullable = false)
    private Coordinates coordinates; //Поле не может быть null

    @NotNull(message = "Creation date cannot be null")
    @Column(nullable = false)
    private ZonedDateTime creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически

    @NotNull(message = "Chapter cannot be null")
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "chapter_id", referencedColumnName = "id", nullable = false)
    private Chapter chapter; //Поле не может быть null

    @Min(value = 1, message = "Health must be greater than 0")
    @Column(nullable = false)
    private int health; //Значение поля должно быть больше 0

    @NotNull(message = "Category cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AstartesCategory category; //Поле не может быть null

    @NotNull(message = "Weapon type cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Weapon weaponType; //Поле не может быть null

    @NotNull(message = "Melee weapon cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeleeWeapon meleeWeapon; //Поле не может быть null

    @PrePersist
    public void prePersist() {
        this.creationDate = ZonedDateTime.now();
    }

    public SpaceMarineDTO toDTO() {
        SpaceMarineDTO dto = new SpaceMarineDTO();
        dto.setId(this.getId());
        dto.setName(this.getName());
        dto.setX(this.getCoordinates().getX());
        dto.setY(this.getCoordinates().getY());
        dto.setCreationDate(this.getCreationDate());
        dto.setChapterName(this.getChapter().getName());
        dto.setChapterWorld(this.getChapter().getWorld());
        dto.setHealth(this.getHealth());
        dto.setCategory(this.getCategory());
        dto.setWeaponType(this.getWeaponType());
        dto.setMeleeWeapon(this.getMeleeWeapon());
        return dto;
    }
}