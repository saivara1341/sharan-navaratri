package com.siddhidynamics.controller;

import com.siddhidynamics.service.SupabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private SupabaseService supabaseService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String body, HttpServletRequest request) {
        // NOTE: never log request/response bodies here — they contain plaintext
        // passwords and access/refresh tokens.
        log.info("AUTH_LOGIN_REQUEST received");
        try {
            ResponseEntity<String> resp = supabaseService.proxyRequest("POST", "/auth/v1/token?grant_type=password",
                    body, request);
            log.info("AUTH_LOGIN_RESPONSE status={}", resp.getStatusCode().value());
            return resp;
        } catch (Exception e) {
            log.error("AUTH_LOGIN_ERROR", e);
            return ResponseEntity.status(500)
                    .body("{\"error\": \"server_error\", \"error_description\": \"Authentication request failed\"}");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody String body, HttpServletRequest request) {
        log.info("AUTH_SIGNUP_REQUEST received");
        try {
            ResponseEntity<String> resp = supabaseService.proxyRequest("POST", "/auth/v1/signup", body, request);
            log.info("AUTH_SIGNUP_RESPONSE status={}", resp.getStatusCode().value());
            return resp;
        } catch (Exception e) {
            log.error("AUTH_SIGNUP_ERROR", e);
            return ResponseEntity.status(500)
                    .body("{\"error\": \"server_error\", \"error_description\": \"Signup request failed\"}");
        }
    }
}
