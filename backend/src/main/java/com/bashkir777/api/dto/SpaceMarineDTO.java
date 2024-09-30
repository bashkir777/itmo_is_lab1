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

    @Nullable
    private Long x;

    @Nullable
    @Min(value = -954, message = "Y must be greater than -954")
    private Double y;

    @Nullable
    private ZonedDateTime creationDate;

    @Nullable
    private String chapterName;

    @Nullable
    private String chapterWorld;

    @Min(value = 1, message = "Health must be greater than 0")
    private int health;

    @NotNull(message = "Category cannot be null")
    private AstartesCategory category;

    @NotNull(message = "Weapon type cannot be null")
    private Weapon weaponType;

    @NotNull(message = "Melee weapon cannot be null")
    private MeleeWeapon meleeWeapon;

    @Nullable
    private Long existingChapterId;

    @Nullable
    private Long existingCoordinateId;

    public SpaceMarine toEntity() throws IllegalArgumentException{
        SpaceMarine spaceMarine = new SpaceMarine();
        spaceMarine.setName(this.getName());

        if (existingCoordinateId != null) {
            Coordinates coordinates = new Coordinates();
            coordinates.setId(existingCoordinateId);
            spaceMarine.setCoordinates(coordinates);
        } else if(this.getX() != null && this.getY() != null) {
            Coordinates coordinates = new Coordinates();
            coordinates.setX(this.getX());
            coordinates.setY(this.getY());
            spaceMarine.setCoordinates(coordinates);
        }else{
            throw new IllegalArgumentException("Coordinates cannot be null");
        }

        if (existingChapterId != null) {
            Chapter chapter = new Chapter();
            chapter.setId(existingChapterId);
            spaceMarine.setChapter(chapter);
        } else if (this.getChapterName() != null && this.getChapterWorld() != null) {
            Chapter chapter = new Chapter();
            chapter.setName(this.getChapterName());
            chapter.setWorld(this.getChapterWorld());
            spaceMarine.setChapter(chapter);
        }else{
            throw new IllegalArgumentException("Chapter cannot be null");
        }

        spaceMarine.setHealth(this.getHealth());
        spaceMarine.setCategory(this.getCategory());
        spaceMarine.setWeaponType(this.getWeaponType());
        spaceMarine.setMeleeWeapon(this.getMeleeWeapon());

        return spaceMarine;
    }

}