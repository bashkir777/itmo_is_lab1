package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.Chapter;
import com.bashkir777.api.data.entities.Coordinates;
import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.repositories.SpaceMarineRepository;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.PaginatedSpaceMarineDTO;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.data.enums.AstartesCategory;
import com.bashkir777.api.data.enums.MeleeWeapon;
import com.bashkir777.api.data.enums.Weapon;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@Disabled
class SpaceMarineServiceTest {

    @Autowired
    private SpaceMarineService spaceMarineService;

    @MockBean
    private SpaceMarineRepository spaceMarineRepository;


    @Test
    void testCreateSpaceMarine() {
        // Arrange
        SpaceMarineDTO dto = new SpaceMarineDTO();
        dto.setName("Test Marine");
        dto.setX(10L);
        dto.setY(10.0);
        dto.setChapterName("Test Chapter");
        dto.setChapterWorld("Test World");
        dto.setHealth(100);
        dto.setCategory(AstartesCategory.AGGRESSOR);
        dto.setWeaponType(Weapon.FLAMER);
        dto.setMeleeWeapon(MeleeWeapon.CHAIN_AXE);

        when(spaceMarineRepository.save(any(SpaceMarine.class))).thenReturn(dto.toEntity());

        // Act
        OperationInfo operationInfo = spaceMarineService.createSpaceMarine(dto);

        // Assert
        assertEquals(true, operationInfo.getSuccess());
        assertEquals("Space Marine successfully created", operationInfo.getMessage());
    }

    @Test
    void testGetAllSpaceMarines() {
        // Arrange
        SpaceMarine marine1 = createSpaceMarine(1, "Marine 1");
        SpaceMarine marine2 = createSpaceMarine(2, "Marine 2");

        List<SpaceMarine> marines = Arrays.asList(marine1, marine2);
        Page<SpaceMarine> marinePage = new PageImpl<>(marines);

        when(spaceMarineRepository.findAll(any(Pageable.class))).thenReturn(marinePage);

        // Act
        PaginatedSpaceMarineDTO paginatedSpaceMarines = spaceMarineService.getAllSpaceMarines(0, 10);
        List<SpaceMarineDTO> spaceMarines = paginatedSpaceMarines.getContent();

        // Assert
        assertEquals(2, spaceMarines.size());
        assertEquals("Marine 1", spaceMarines.get(0).getName());
        assertEquals("Marine 2", spaceMarines.get(1).getName());
        assertEquals(10L, spaceMarines.get(0).getX());
        assertEquals(10.0, spaceMarines.get(0).getY());
        assertEquals("Test Chapter", spaceMarines.get(0).getChapterName());
        assertEquals("Test World", spaceMarines.get(0).getChapterWorld());
        assertEquals(100, spaceMarines.get(0).getHealth());
        assertEquals(AstartesCategory.AGGRESSOR, spaceMarines.get(0).getCategory());
        assertEquals(Weapon.FLAMER, spaceMarines.get(0).getWeaponType());
        assertEquals(MeleeWeapon.CHAIN_AXE, spaceMarines.get(0).getMeleeWeapon());
    }

    @Test
    void testGetSpaceMarineById() {
        // Arrange
        SpaceMarine marine = createSpaceMarine(1, "Test Marine");

        when(spaceMarineRepository.findById(1)).thenReturn(Optional.of(marine));

        // Act
        SpaceMarine spaceMarine = spaceMarineService.getSpaceMarineById(1);

        // Assert
        assertEquals("Test Marine", spaceMarine.getName());
        assertEquals(10L, spaceMarine.getCoordinates().getX());
        assertEquals(10.0, spaceMarine.getCoordinates().getY());
        assertEquals("Test Chapter", spaceMarine.getChapter().getName());
        assertEquals("Test World", spaceMarine.getChapter().getWorld());
        assertEquals(100, spaceMarine.getHealth());
        assertEquals(AstartesCategory.AGGRESSOR, spaceMarine.getCategory());
        assertEquals(Weapon.FLAMER, spaceMarine.getWeaponType());
        assertEquals(MeleeWeapon.CHAIN_AXE, spaceMarine.getMeleeWeapon());
    }

    @Test
    void testGetSpaceMarineByIdNotFound() {
        // Arrange
        when(spaceMarineRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            spaceMarineService.getSpaceMarineById(1);
        });
    }

    private SpaceMarine createSpaceMarine(int id, String name) {
        SpaceMarine marine = new SpaceMarine();
        marine.setId(id);
        marine.setName(name);
        marine.setCoordinates(new Coordinates(1L, 10L, 10.0));
        marine.setCreationDate(ZonedDateTime.now());
        marine.setChapter(new Chapter(1L, "Test Chapter", "Test World"));
        marine.setHealth(100);
        marine.setCategory(AstartesCategory.AGGRESSOR);
        marine.setWeaponType(Weapon.FLAMER);
        marine.setMeleeWeapon(MeleeWeapon.CHAIN_AXE);
        return marine;
    }
}