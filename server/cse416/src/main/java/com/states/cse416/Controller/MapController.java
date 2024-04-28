package com.states.cse416.Controller;

import com.states.cse416.Models.District;
import com.states.cse416.Models.Precinct;
import com.states.cse416.Service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class MapController {

    @Autowired
    private PrecinctService precinctService;


    @GetMapping("/mapData/{state}")
    public String fetchStateJson(@PathVariable String state) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "";
        if (state.equals("MS")) {
            url = "https://redistricting.lls.edu/wp-content/uploads/ms_2020_congress_2022-01-24.json";

        } else if (state.equals("NV")) {
            url = "https://redistricting.lls.edu/wp-content/uploads/nv_2020_congress_2021-11-16.json";
        } else {
            return "Invalid";
        }

        return restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/allPrecincts")
    public ResponseEntity<List<Precinct>> getPrecincts() {
        return new ResponseEntity<>(precinctService.getAllPrecincts(), HttpStatus.OK);
    }


    @GetMapping("/helloWorld")
    public String getHello() {
        return "Hello World";
    }
}
