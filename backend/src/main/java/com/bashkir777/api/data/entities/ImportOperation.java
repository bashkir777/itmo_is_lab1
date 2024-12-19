package com.bashkir777.api.data.entities;

import com.bashkir777.api.dto.ImportDTO;
import com.bashkir777.api.services.enums.ImportStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "import_operation")
public class ImportOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(value = EnumType.STRING)
    private ImportStatus status;

    private Integer counter;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private User creator;

    public ImportDTO toDTO(){
        return ImportDTO.builder()
                .id(id)
                .counter(counter)
                .status(status.name())
                .creatorName(creator.getUsername())
                .build();
    }
}
