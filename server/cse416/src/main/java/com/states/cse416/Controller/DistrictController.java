package com.states.cse416.Controller;

import com.states.cse416.Models.Ensemble;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")

public class DistrictController {

    public ResponseEntity<Optional> getCurrentPlan() {
        return null;
    }

    @GetMapping("/ensemblePlan/{ensembleId}")
    public ResponseEntity<Ensemble> getEnsemblePlanById(@PathVariable String ensembleId) {
        return null;
    }
}
