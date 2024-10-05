package com.bashkir777.api.data.repositories;

import com.bashkir777.api.data.entities.AdminApplication;
import com.bashkir777.api.data.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminApplicationRepository extends JpaRepository<AdminApplication, Long> {
    Optional<AdminApplication> findByUser(User user);
}
