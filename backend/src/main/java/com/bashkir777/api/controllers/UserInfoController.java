package com.bashkir777.api.controllers;

import com.bashkir777.api.dto.OperationInfo;
import com.bashkir777.api.dto.UserInfoDTO;
import com.bashkir777.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable String username) throws BadCredentialsException {
        var user = userService.getUserByUsername(username).
                orElseThrow(() -> new BadCredentialsException("User not found"));
        return ResponseEntity.ok(UserInfoDTO.builder().username(user.getUsername()).
                role(user.getRole().name()).firstname(user.getFirstname()).
                lastname(user.getLastname()).build());
    }

    @ExceptionHandler({RuntimeException.class})
    private ResponseEntity<OperationInfo> badCredentials(RuntimeException exception) {
        exception.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(OperationInfo.builder().success(false)
                        .message(exception.getMessage()).build());
    }
}
