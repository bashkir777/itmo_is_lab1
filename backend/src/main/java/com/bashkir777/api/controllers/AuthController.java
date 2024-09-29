package com.bashkir777.api.controllers;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.bashkir777.api.dto.*;
import com.bashkir777.api.services.AuthenticationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;


    @PostMapping("/register")
    public ResponseEntity<OperationInfo> register(@RequestBody RegisterRequest registerRequest)
            throws BadCredentialsException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest loginRequest)
            throws BadCredentialsException, JsonProcessingException {
        return ResponseEntity.status(HttpStatus.OK)
                .body(authenticationService.login(loginRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessToken> refresh(@RequestBody RefreshTokenDTO refreshTokenDTO)
            throws JWTVerificationException {
        return ResponseEntity.status(HttpStatus.OK)
                .body(authenticationService.refresh(refreshTokenDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<OperationInfo> logout(@RequestBody RefreshTokenDTO refreshTokenDTO)
            throws JWTVerificationException, BadCredentialsException {
        authenticationService.logout(refreshTokenDTO);
        return ResponseEntity.status(HttpStatus.OK)
                .body(OperationInfo.builder().success(true)
                        .message("You have logged out successfully").build());
    }



    @ExceptionHandler({JWTVerificationException.class, BadCredentialsException.class, JsonProcessingException.class})
    private ResponseEntity<OperationInfo> badCredentials(Exception exception) {
        exception.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(OperationInfo.builder().success(false)
                        .message(exception.getMessage()).build());
    }

}
