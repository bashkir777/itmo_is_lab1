package com.bashkir777.api.services.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TokenType {
    REFRESH(30L * 24 * 60 * 60 * 1000), ACCESS(5 * 60  * 1000);

    private final long timeAliveMillis;
}
