package com.bashkir777.api.filters;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.bashkir777.api.configuration.security.SecurityConfig;
import com.bashkir777.api.services.JwtService;
import com.bashkir777.api.services.enums.TokenType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private void writeUnauthorizedResponse(@NonNull HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(message);
        response.getWriter().flush();
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request
            , @NonNull HttpServletResponse response
            , @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        String[] staticResources = {".html", ".css", ".jpg", ".jpeg", ".js", ".png"};

        for(var staticResource : staticResources) {
            if(requestUri.endsWith(staticResource)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        //if list of open uris includes requested uri -> skip filter
        for (String pattern : SecurityConfig.openUris) {
            String regexPattern = pattern.replace("**", ".*");
            if (Pattern.compile(regexPattern).matcher(requestUri).matches()) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Access token is absent or not in the correct format
            // go user+password authentication
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.split(" ")[1];
        //if token is expired or forged send Error
        DecodedJWT decodedJWT;
        try{
            decodedJWT = jwtService.decodeAndValidateToken(jwt);
        }catch (JWTVerificationException e){
            writeUnauthorizedResponse(response, "invalid token");
            return;
        }

        String username = jwtService.getEmailFromToken(decodedJWT);

        TokenType type = jwtService.getTypeFromToken(decodedJWT);

        if (type.equals(TokenType.ACCESS)) {
            if (username != null) {
                UserDetails user = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }else{
            writeUnauthorizedResponse(response, "refresh token cant be used as an access token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
