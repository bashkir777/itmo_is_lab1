package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.data.repositories.UserRepository;
import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.RegisterRequest;
import com.bashkir777.api.services.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public void setPasswordEncoder(@Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public OperationInfo register(RegisterRequest registerRequest) throws BadCredentialsException {
        if (registerRequest.getPassword().length() < 7) {
            return new OperationInfo(false, "Password must be at least 7 characters long.");
        }
        if (registerRequest.getUsername().length() < 7) {
            return new OperationInfo(false, "Username must be at least 7 characters long.");
        }
        if (registerRequest.getFirstname().length() < 7) {
            return new OperationInfo(false, "Firstname must be at least 7 characters long.");
        }
        if (registerRequest.getLastname().length() < 7) {
            return new OperationInfo(false, "Lastname must be at least 7 characters long.");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        var optionalUser = userRepository.findByUsername(registerRequest.getUsername());

        if (optionalUser.isPresent()) {
            throw new BadCredentialsException("Username is already taken.");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(encodedPassword)
                .firstname(registerRequest.getFirstname())
                .lastname(registerRequest.getLastname())
                .role(Role.USER) // Assuming default role is USER
                .build();

        try {
            userRepository.save(user);
            return OperationInfo.builder()
                    .success(true)
                    .message("User successfully registered")
                    .build();
        } catch (Exception e) {
            return OperationInfo.builder()
                    .success(false)
                    .message("Error occurred while creating user")
                    .build();
        }
    }

    public boolean deleteUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

}