package com.states.cse416;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class Cse416Application {

	public static void main(String[] args) {
		SpringApplication.run(Cse416Application.class, args);
	}

}
