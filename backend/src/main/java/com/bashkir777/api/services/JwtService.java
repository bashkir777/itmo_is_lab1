package com.bashkir777.api.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bashkir777.api.dto.AuthenticationResponse;
import com.bashkir777.api.services.enums.Role;
import com.bashkir777.api.services.enums.TokenType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final Algorithm algorithm;

    public JwtService(@Value("jwt.secret") String secret){
        this.algorithm = Algorithm.HMAC256(secret);
    }


    public String createJwt(String username, TokenType tokenType, Role role){
        return JWT.create()
                .withIssuer("auth-service")
                .withSubject(username)
                .withClaim("role", role.name())
                .withClaim("type", tokenType.name())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenType.getTimeAliveMillis()))
                .sign(algorithm);
    }

    public AuthenticationResponse createAuthenticationResponse(String email, Role role){
        return AuthenticationResponse.builder()
                .accessToken(createJwt(email, TokenType.ACCESS, role))
                .refreshToken(createJwt(email, TokenType.REFRESH, role))
                .role(role.name())
                .build();
    }
    public DecodedJWT decodeAndValidateToken(String jwt) throws JWTVerificationException {
        return JWT.require(algorithm)
                .withIssuer("auth-service")
                .build()
                .verify(jwt);
    }

    public String getEmailFromToken(String jwt) throws JWTVerificationException{
        return decodeAndValidateToken(jwt).getSubject();
    }

    public String getEmailFromToken(DecodedJWT decodedJWT) throws JWTVerificationException{
        return decodedJWT.getSubject();
    }

    public TokenType getTypeFromToken(String jwt) throws JWTVerificationException{
        return TokenType.valueOf(decodeAndValidateToken(jwt).getClaim("type").asString());
    }

    public TokenType getTypeFromToken(DecodedJWT decodedJWT) throws JWTVerificationException{
        return TokenType.valueOf(decodedJWT.getClaim("type").asString());
    }

    public Role getRoleFromToken(String jwt) throws JWTVerificationException{
        return Role.valueOf(decodeAndValidateToken(jwt).getClaim("role").asString());
    }

    public Role getRoleFromToken(DecodedJWT decodedJWT) throws JWTVerificationException{
        return Role.valueOf(decodedJWT.getClaim("role").asString());
    }

}
