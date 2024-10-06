package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.SpaceMarine;
import com.bashkir777.api.data.entities.Updated;
import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.data.repositories.UpdatedRepository;
import com.bashkir777.api.dto.OperationInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UpdatedService {

    private final UpdatedRepository repo;

    public OperationInfo createRecord(User user, SpaceMarine spaceMarine) {
        var updatedRecord = new Updated();
        updatedRecord.setUpdatedBy(user);
        updatedRecord.setUpdatedSpaceMarine(spaceMarine);
        repo.save(updatedRecord);
        return new OperationInfo(true, "record successfully saved");
    }

}
