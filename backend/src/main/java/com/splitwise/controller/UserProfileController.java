package com.splitwise.controller;

import com.splitwise.dto.UserProfileDto;
import com.splitwise.dto.UserDto;
import com.splitwise.model.User;
import com.splitwise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserService userService;

    // Get current user's profile
    @GetMapping
    public ResponseEntity<UserProfileDto> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new UserProfileDto(userOpt.get()));
    }

    // Update user profile
    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto profileDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Update basic profile fields
        if (profileDto.getFirstName() != null) {
            user.setFirstName(profileDto.getFirstName());
        }
        if (profileDto.getLastName() != null) {
            user.setLastName(profileDto.getLastName());
        }
        if (profileDto.getPhone() != null) {
            user.setPhone(profileDto.getPhone());
        }
        if (profileDto.getDefaultCurrency() != null) {
            user.setDefaultCurrency(profileDto.getDefaultCurrency());
        }
        if (profileDto.getTimezone() != null) {
            user.setTimezone(profileDto.getTimezone());
        }
        if (profileDto.getLanguage() != null) {
            user.setLanguage(profileDto.getLanguage());
        }

        // Save the updated user
        User updatedUser = userService.updateUserProfile(user);
        return ResponseEntity.ok(new UserProfileDto(updatedUser));
    }

    // Update avatar
    @PutMapping("/avatar")
    public ResponseEntity<Map<String, String>> updateAvatar(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        String avatarUrl = request.get("avatarUrl");
        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
            userService.updateUserProfile(user);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar updated successfully");
        response.put("avatarUrl", avatarUrl);
        return ResponseEntity.ok(response);
    }

    // Update notification preferences
    @PutMapping("/notifications")
    public ResponseEntity<UserProfileDto> updateNotificationPreferences(@RequestBody Map<String, Boolean> preferences) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Update notification preferences
        if (preferences.containsKey("emailNotifications")) {
            user.setEmailNotifications(preferences.get("emailNotifications"));
        }
        if (preferences.containsKey("pushNotifications")) {
            user.setPushNotifications(preferences.get("pushNotifications"));
        }
        if (preferences.containsKey("expenseNotifications")) {
            user.setExpenseNotifications(preferences.get("expenseNotifications"));
        }
        if (preferences.containsKey("settlementNotifications")) {
            user.setSettlementNotifications(preferences.get("settlementNotifications"));
        }

        User updatedUser = userService.updateUserProfile(user);
        return ResponseEntity.ok(new UserProfileDto(updatedUser));
    }

        // Update account settings
    @PutMapping("/settings")
    public ResponseEntity<UserProfileDto> updateAccountSettings(@RequestBody Map<String, Object> settings) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();

        // Update account settings
        if (settings.containsKey("defaultCurrency")) {
            user.setDefaultCurrency((String) settings.get("defaultCurrency"));
        }
        if (settings.containsKey("timezone")) {
            user.setTimezone((String) settings.get("timezone"));
        }
        if (settings.containsKey("language")) {
            user.setLanguage((String) settings.get("language"));
        }

        User updatedUser = userService.updateUserProfile(user);
        return ResponseEntity.ok(new UserProfileDto(updatedUser));
    }

        // Get user profile by ID (public profile)
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();

        // Create a public profile DTO (exclude sensitive information)
        UserProfileDto publicProfile = new UserProfileDto(user);
        // You could add logic here to exclude certain fields based on privacy settings
        
        return ResponseEntity.ok(publicProfile);
    }

        // Update last login time
    @PostMapping("/last-login")
    public ResponseEntity<Map<String, String>> updateLastLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();

        user.setLastLogin(java.time.LocalDateTime.now());
        userService.updateUserProfile(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Last login updated successfully");
        return ResponseEntity.ok(response);
    }

        // Get user statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();

        Map<String, Object> stats = new HashMap<>();
        stats.put("userId", user.getId());
        stats.put("username", user.getUsername());
        stats.put("memberSince", user.getCreatedAt());
        stats.put("lastLogin", user.getLastLogin());
        stats.put("isVerified", user.getIsVerified());
        stats.put("twoFactorEnabled", user.getTwoFactorEnabled());
        
        // You could add more stats here like:
        // - Total groups joined
        // - Total expenses created
        // - Total settlements made
        // - etc.

        return ResponseEntity.ok(stats);
    }

        // Delete user account (soft delete)
    @DeleteMapping
    public ResponseEntity<Map<String, String>> deactivateAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();

        // Soft delete - set account as inactive
        user.setIsActive(false);
        userService.updateUserProfile(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deactivated successfully");
        return ResponseEntity.ok(response);
    }
}
