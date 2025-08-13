package com.splitwise.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.splitwise.service.CustomUserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String token = authHeader.substring(7); // Remove "Bearer "

            // For now, we'll use a simple approach - extract user ID from our dummy token
            // In a real app, you'd decode the JWT token
            if (token.startsWith("dummy-token-")) {
                // Extract user ID from the token (this is a temporary solution)
                // In a real app, you'd decode the JWT and extract claims
                String userIdStr = token.replace("dummy-token-", "");
                try {
                    Long userId = Long.parseLong(userIdStr);
                    UserDetails userDetails = userDetailsService.loadUserById(userId);

                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (NumberFormatException e) {
                    // Invalid token format
                }
            }
        } catch (Exception e) {
            // Token validation failed
        }

        filterChain.doFilter(request, response);
    }
}
