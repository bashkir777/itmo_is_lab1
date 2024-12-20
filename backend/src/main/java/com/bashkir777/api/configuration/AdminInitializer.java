package com.bashkir777.api.configuration;

import com.bashkir777.api.dto.RegisterRequest;
import com.bashkir777.api.services.UserService;
import com.bashkir777.api.services.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;


    @Override
    public void run(String... args) throws Exception {

        for (int i = 1; i <= 3; i++) {
            String adminName = "administrator" + i;
            userService.register(RegisterRequest.builder()
                    .username(adminName).password(adminName).
                    firstname(adminName).lastname(adminName).build());
            var user = userService.getUserByUsername(adminName).
                    orElseThrow(() -> new RuntimeException("administrator not found"));
            user.setRole(Role.ADMIN);
            userService.saveUser(user);
        }
        for (int i = 1; i <= 3; i++) {
            String userName = "user__" + i;
            userService.register(RegisterRequest.builder()
                    .username(userName).password(userName).
                    firstname(userName).lastname(userName).build());
            userService.getUserByUsername(userName).
                    orElseThrow(() -> new RuntimeException("user not found"));
        }


    }

}
