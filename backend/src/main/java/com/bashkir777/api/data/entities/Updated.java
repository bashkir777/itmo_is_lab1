package com.bashkir777.api.data.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "updated")
public class Updated {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "id", nullable = false)
    private User updatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_space_marine", referencedColumnName = "id", nullable = false)
    private SpaceMarine updatedSpaceMarine;

    @Column(nullable = false)
    private ZonedDateTime updateDate;

    @PrePersist
    public void prePersist() {
        this.updateDate = ZonedDateTime.now();
    }

}
