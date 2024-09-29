package com.bashkir777.api.controllers;

import com.bashkir777.api.data.enums.AstartesCategory;
import com.bashkir777.api.data.enums.MeleeWeapon;
import com.bashkir777.api.data.enums.Weapon;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.SpaceMarineDTO;
import com.bashkir777.api.services.SpaceMarineService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SpaceMarineControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SpaceMarineService spaceMarineService;

    @InjectMocks
    private SpaceMarineController spaceMarineController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(spaceMarineController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testCreateSpaceMarine() throws Exception {
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

        OperationInfo operationInfo = new OperationInfo(true, "SpaceMarine successfully created");

        when(spaceMarineService.createSpaceMarine(any(SpaceMarineDTO.class))).thenReturn(operationInfo);

        // Act & Assert
        mockMvc.perform(post("/space-marines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }
}