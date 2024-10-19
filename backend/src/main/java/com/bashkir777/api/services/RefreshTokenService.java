package com.bashkir777.api.services;

import com.bashkir777.api.data.entities.RefreshToken;
import com.bashkir777.api.data.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;


    public Optional<RefreshToken> getRefreshTokenByUserId(Long userId) throws BadCredentialsException {
        return refreshTokenRepository.findByUser_Id(userId);
    }

    public boolean deleteRefreshTokenByUserId(Long userId) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUser_Id(userId);
        if (refreshToken.isPresent()) {
            refreshTokenRepository.delete(refreshToken.get());
            return true;
        }
        return false;
    }

    public void saveRefreshToken(RefreshToken refreshToken) {
        Optional<RefreshToken> existingRefreshToken = refreshTokenRepository.findByUser_Id(refreshToken.getUser().getId());
        existingRefreshToken.ifPresent(refreshTokenRepository::delete);
        refreshTokenRepository.save(refreshToken);
    }
}