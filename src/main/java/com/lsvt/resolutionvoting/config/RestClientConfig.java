package com.lsvt.resolutionvoting.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient templeRestClient() {
        return RestClient.builder()
                .baseUrl("https://livermoretemple.org:9003")
                .defaultHeader("Accept", "application/json")
                .build();
    }
}