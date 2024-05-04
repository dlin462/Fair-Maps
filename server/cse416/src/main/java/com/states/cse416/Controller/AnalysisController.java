package com.states.cse416.Controller;

import com.states.cse416.Models.enums.StateName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")

public class AnalysisController {


//    @GetMapping("/{state}/barChart")
//    public ResponseEntity<Object> getBarChart(@PathVariable StateName state) {
//
//    }
//
//    public ResponseEntity<Object> getEcologicalInference() {
////        {Election Type}/{Race}
//        return new ResponseEntity<>(new Object(), HttpStatus.OK);
//    }
}
