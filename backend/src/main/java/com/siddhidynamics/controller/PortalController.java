package com.siddhidynamics.controller;

import com.siddhidynamics.service.SupabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortalController {

    @Autowired
    private SupabaseService supabaseService;

    @PostMapping("/contact-submissions")
    public ResponseEntity<String> submitContactForm(@RequestBody String body, HttpServletRequest request)
            throws Exception {
        // Path matches the REST table in Supabase
        return supabaseService.proxyRequest("POST", "/rest/v1/contact_submissions", body, request);
    }

    @GetMapping("/contact-submissions")
    public ResponseEntity<String> getSubmissions(
            @RequestParam(required = false) String email,
            HttpServletRequest request) throws Exception {
        String path = "/rest/v1/contact_submissions?select=*";
        if (email != null && !email.isEmpty()) {
            path += "&email=eq." + email;
        }
        return supabaseService.proxyRequest("GET", path, null, request);
    }

    @PostMapping("/project-waitlist")
    public ResponseEntity<String> addToWaitlist(@RequestBody String body, HttpServletRequest request) throws Exception {
        return supabaseService.proxyRequest("POST", "/rest/v1/project_waitlist", body, request);
    }

    @GetMapping("/project-waitlist")
    public ResponseEntity<String> getWaitlistEntries(
            @RequestParam(required = false) String email,
            HttpServletRequest request) throws Exception {
        String path = "/rest/v1/project_waitlist?select=*";
        if (email != null && !email.isEmpty()) {
            path += "&email=eq." + email;
        }
        return supabaseService.proxyRequest("GET", path, null, request);
    }

    @RequestMapping(value = "/proxy/**", method = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
            RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS })
    public ResponseEntity<String> genericProxy(jakarta.servlet.http.HttpServletRequest request) {
        try {
            String fullPath = request.getRequestURI().replace("/api/proxy", "");
            String queryString = request.getQueryString();
            if (queryString != null && !queryString.isEmpty()) {
                fullPath += "?" + queryString;
            }
            String method = request.getMethod();

            // Read the full original body bytes to prevent Spring Boot's strict String
            // converter from throwing a 400 Error.
            byte[] bodyBytes = request.getInputStream().readAllBytes();
            String body = bodyBytes.length > 0 ? new String(bodyBytes, java.nio.charset.StandardCharsets.UTF_8) : null;

            return supabaseService.proxyRequest(method, fullPath, body, request);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("{\"error\": \"proxy_error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/status")
    public String getStatus() {
        return "{\"status\": \"Online\", \"engine\": \"Java Spring Boot\", \"load_capacity\": \"100k+\"}";
    }
}
