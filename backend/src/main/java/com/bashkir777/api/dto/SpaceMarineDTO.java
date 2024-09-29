package com.bashkir777.api.dto;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.enums.AstartesCategory;
import com.bashkir777.api.data.enums.MeleeWeapon;
import com.bashkir777.api.data.enums.Weapon;
import jakarta.annotation.Nullable;
import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

@Data
public class SpaceMarineDTO {

    @Nullable
    private Integer id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotNull(message = "X coordinate cannot be null")
    private Long x;

    @Min(value = -954, message = "Y must be greater than -954")
    @NotNull(message = "Y coordinate cannot be null")
    private Double y;

    @Nullable
    private ZonedDateTime creationDate;

    @NotBlank(message = "Chapter name cannot be blank")
    private String chapterName;

    @NotNull(message = "Chapter world cannot be null")
    private String chapterWorld;

    @Min(value = 1, message = "Health must be greater than 0")
    private int health;

    @NotNull(message = "Category cannot be null")
    private AstartesCategory category;

    @NotNull(message = "Weapon type cannot be null")
    private Weapon weaponType;

    @NotNull(message = "Melee weapon cannot be null")
    private MeleeWeapon meleeWeapon;

    public SpaceMarine toEntity() {
        SpaceMarine spaceMarine = new SpaceMarine();
        spaceMarine.setName(this.getName());

        Coordinates coordinates = new Coordinates();
        coordinates.setX(this.getX());
        coordinates.setY(this.getY());
        spaceMarine.setCoordinates(coordinates);

        Chapter chapter = new Chapter();
        chapter.setName(this.getChapterName());
        chapter.setWorld(this.getChapterWorld());
        spaceMarine.setChapter(chapter);

        spaceMarine.setHealth(this.getHealth());
        spaceMarine.setCategory(this.getCategory());
        spaceMarine.setWeaponType(this.getWeaponType());
        spaceMarine.setMeleeWeapon(this.getMeleeWeapon());

        return spaceMarine;
    }

}
