package com.states.cse416.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class DistrictController {

    public ResponseEntity<Optional> getCurrentPlan() {
        return null;
    }

    @GetMapping("/PlaceHolder/{ensembleId}")
    public ResponseEntity<Optional> getEnsemblePlan(@PathVariable String ensembleId) {
        return null;
    }
}
