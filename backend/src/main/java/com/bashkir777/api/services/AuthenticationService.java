package com.bashkir777.api.services;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bashkir777.api.data.entities.RefreshToken;
import com.bashkir777.api.data.entities.User;
import com.bashkir777.api.dto.*;
import com.bashkir777.api.services.enums.Role;
import com.bashkir777.api.services.enums.TokenType;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final AdminApplicationService adminApplicationService;

    public OperationInfo register(RegisterRequest registerRequest) throws BadCredentialsException {
        return userService.register(registerRequest);
    }

    public User getUser(String username) throws BadCredentialsException {
        return userService.getUserByUsername(username).orElseThrow(
                () -> new BadCredentialsException("There is no user with such username")
        );
    }

    public AuthenticationResponse createAuthenticationResponseAndSaveRefreshToken(User user) {
        AuthenticationResponse answer = jwtService.createAuthenticationResponse(user.getUsername(), user.getRole());

        refreshTokenService.saveRefreshToken(
                RefreshToken.builder()
                        .token(answer.getRefreshToken())
                        .user(user)
                        .build()
        );
        return answer;
    }

    public AuthenticationResponse login(LoginRequest loginRequest) throws BadCredentialsException, JsonProcessingException {
        User user = userService.getUserByUsername(
                loginRequest.getUsername()
        ).orElseThrow(() -> new BadCredentialsException("There is no user with such email"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return createAuthenticationResponseAndSaveRefreshToken(user);
    }

    public AccessToken refresh(RefreshTokenDTO refreshToken) throws JWTVerificationException, BadCredentialsException {
        DecodedJWT decodedJWT = jwtService.decodeAndValidateToken(refreshToken.getRefreshToken());

        String email = decodedJWT.getSubject();

        User user = getUser(email);

        var optionalRefreshToken = refreshTokenService.getRefreshTokenByUserId(user.getId());

        optionalRefreshToken.orElseThrow(()-> new BadCredentialsException("this refresh token is not valid anymore. login again"));

        Role role = Role.valueOf(decodedJWT.getClaim("role").asString());

        return AccessToken.builder().accessToken(jwtService
                .createJwt(email, TokenType.ACCESS, role)).build();
    }

    public void logout(RefreshTokenDTO refreshToken) throws JWTVerificationException, BadCredentialsException {
        DecodedJWT decodedJWT = jwtService.decodeAndValidateToken(refreshToken.getRefreshToken());

        String username = decodedJWT.getSubject();

        User user = getUser(username);

        refreshTokenService.deleteRefreshTokenByUserId(user.getId());
    }

    public OperationInfo adminApplication(RegisterRequest registerRequest) throws BadCredentialsException {
        userService.register(registerRequest);
        var user = userService.getUserByUsername(registerRequest.getUsername()).orElseThrow(()->new BadCredentialsException("Error creating user"));
        return adminApplicationService.createNewAdminApplication(user);
    }
}