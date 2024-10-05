package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.AdminApplication;
import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.data.enums.ApplicationStatus;
import com.bashkir777.api.data.repositories.AdminApplicationRepository;
import com.bashkir777.api.data.repositories.UserRepository;
import com.bashkir777.api.dto.ApplicationDTO;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.services.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminApplicationService {

    private final AdminApplicationRepository adminApplicationRepository;
    private final UserRepository userRepository;

    public List<ApplicationDTO> getAdminUnconsideredApplications() {
        return adminApplicationRepository.findAll().stream().
                filter(a -> a.getApplicationStatus().equals(ApplicationStatus.CONSIDERATION)).
                map(a -> ApplicationDTO.builder().id(a.getId()).
                        username(a.getUser().getUsername()).
                        firstname(a.getUser().getFirstname()).
                        lastname(a.getUser().getLastname()).build()).toList();
    }

    public OperationInfo createNewAdminApplication(User user){
        var adminApplication = new AdminApplication();
        adminApplication.setUser(user);
        adminApplication.setApplicationStatus(ApplicationStatus.CONSIDERATION);
        adminApplicationRepository.save(adminApplication);
        return new OperationInfo(true, "application created");
    }


    public OperationInfo acceptApplication(long id){

        var application = adminApplicationRepository.findById(id).
                orElseThrow(()->new RuntimeException("application not found"));
        User user = application.getUser();
        application.setApplicationStatus(ApplicationStatus.ACCEPTED);
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        adminApplicationRepository.save(application);
        return new OperationInfo(true, "application accepted");
    }

    public OperationInfo rejectApplication(long id){
        var application = adminApplicationRepository.findById(id).
                orElseThrow(()->new RuntimeException("application not found"));
        application.setApplicationStatus(ApplicationStatus.REJECTED);
        adminApplicationRepository.save(application);
        return new OperationInfo(true, "application rejected");
    }

}
