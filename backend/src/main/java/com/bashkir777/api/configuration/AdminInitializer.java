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
        var optionalUser = userService.getUserByUsername("admin");
        if (optionalUser.isEmpty()) {
            userService.register(RegisterRequest.builder()
                    .username("administrator").password("administrator").
                    firstname("administrator").lastname("administrator").build());

            var user = userService.getUserByUsername("administrator").
                    orElseThrow(()->new RuntimeException("administrator not found"));
            user.setRole(Role.ADMIN);
            userService.saveUser(user);
        }
    }
    
}
