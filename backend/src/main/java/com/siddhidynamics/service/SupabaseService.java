package com.siddhidynamics.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.support.ClassicRequestBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import org.apache.hc.client5.http.DnsResolver;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;

import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;

@Service
public class SupabaseService {

    static {
        // Re-enabling SNI: Cloudflare requires SNI for the TLS handshake.
        System.setProperty("jsse.enableSNIExtension", "true");
    }

    private static final Logger log = LoggerFactory.getLogger(SupabaseService.class);

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon.key}")
    private String supabaseAnonKey;

    @Value("${supabase.publishable.key}")
    private String supabasePublishableKey;

    @Value("${supabase.proxy.ip:172.64.149.246}")
    private String proxyIp;

    private CloseableHttpClient createHttpClient() {
        DnsResolver customDnsResolver = new DnsResolver() {
            @Override
            public InetAddress[] resolve(final String host) throws UnknownHostException {
                try {
                    String targetHost = new URI(supabaseUrl).getHost();
                    if (host.equalsIgnoreCase(targetHost)) {
                        log.debug("Custom DNS: Resolving {} to proxy IP {}", host, proxyIp);
                        return new InetAddress[] { InetAddress.getByName(proxyIp) };
                    }
                } catch (Exception e) {
                    log.error("Custom DNS: Failed to parse supabaseUrl", e);
                }
                return InetAddress.getAllByName(host);
            }

            @Override
            public String resolveCanonicalHostname(String host) {
                return host;
            }
        };

        PoolingHttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                .setDnsResolver(customDnsResolver)
                .build();

        return HttpClients.custom()
                .setConnectionManager(connectionManager)
                .build();
    }

    public ResponseEntity<String> proxyRequest(String method, String path, String body) throws Exception {
        return proxyRequest(method, path, body, null);
    }

    public ResponseEntity<String> proxyRequest(String method, String path, String body,
            HttpServletRequest originalRequest) throws Exception {
        String targetUrl = supabaseUrl + path;
        String hostHeader = supabaseUrl.replace("https://", "");

        log.debug("Proxying {} request to: {}", method, targetUrl);

        try (CloseableHttpClient httpClient = createHttpClient()) {

            ClassicRequestBuilder requestBuilder = ClassicRequestBuilder.create(method)
                    .setUri(targetUrl)
                    .setHeader("host", hostHeader)
                    .setHeader("apikey", supabasePublishableKey);

            // If we don't have an original request or it doesn't have an Authorization
            // header, use the service key
            boolean hasAuthHeader = false;

            if (originalRequest != null) {
                log.debug("--- Incoming Headers from Client ---");
                Enumeration<String> headerNames = originalRequest.getHeaderNames();
                if (headerNames != null) {
                    while (headerNames.hasMoreElements()) {
                        String headerName = headerNames.nextElement();
                        String headerValue = originalRequest.getHeader(headerName);
                        log.debug("{}: {}", headerName, headerValue);

                        // Skip headers that might cause issues or are overridden
                        if (headerName.equalsIgnoreCase("host") ||
                                headerName.equalsIgnoreCase("connection") ||
                                headerName.equalsIgnoreCase("content-length") ||
                                headerName.equalsIgnoreCase("accept-encoding") ||
                                headerName.equalsIgnoreCase("apikey")) {
                            continue;
                        }

                        if (headerName.equalsIgnoreCase("authorization")) {
                            hasAuthHeader = true;
                        }

                        requestBuilder.setHeader(headerName, headerValue);
                    }
                }
                log.debug("------------------------------------");
            }

            if (!hasAuthHeader) {
                requestBuilder.setHeader("Authorization", "Bearer " + supabaseAnonKey);
            }

            if (body != null && ("POST".equalsIgnoreCase(method) || "PATCH".equalsIgnoreCase(method)
                    || "PUT".equalsIgnoreCase(method))) {
                if (originalRequest == null || originalRequest.getHeader("Content-Type") == null) {
                    requestBuilder.setHeader("Content-Type", "application/json");
                }
                requestBuilder.setHeader("Prefer", "return=representation");
                requestBuilder.setEntity(new StringEntity(body, StandardCharsets.UTF_8));
            }

            return httpClient.execute(requestBuilder.build(), response -> {
                String result = response.getEntity() != null
                        ? EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8)
                        : "";
                log.trace("Proxy Response HTTP {}: {}", response.getCode(), result);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                return new ResponseEntity<>(result, headers, HttpStatus.valueOf(response.getCode()));
            });

        } catch (Exception e) {
            log.error("CRITICAL: Supabase proxy request failed: {}", e.getMessage(), e);
            throw e;
        }
    }
}
