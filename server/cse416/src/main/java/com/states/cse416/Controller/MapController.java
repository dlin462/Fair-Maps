package com.states.cse416.Controller;

import com.states.cse416.Models.District;
import com.states.cse416.Models.Precinct;
import com.states.cse416.Models.State;
import com.states.cse416.Models.StateAssembly;
import com.states.cse416.Service.PrecinctService;
import com.states.cse416.Service.StateWideDataService;
import com.states.cse416.Service.StateAssemblyService;
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

    @Autowired
    private StateWideDataService stateWideDataService;

    @Autowired
    private StateAssemblyService stateAssemblyService;


    @GetMapping("/map/{state}")
    public String fetchStateJson(@PathVariable String state) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "";
        if (state.equals("mississippi")) {
            url = "https://redistricting.lls.edu/wp-content/uploads/ms_2020_congress_2022-01-24.json";

        } else if (state.equals("nevada")) {
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

    @GetMapping("/stateTable")
    public ResponseEntity<List<State>> getStateTable() {
        return new ResponseEntity<>(stateWideDataService.getTable(), HttpStatus.OK);
    }

    @GetMapping("/stateAssemblyTable")
    public ResponseEntity<List<StateAssembly>> getAssemblyStateTable() {
        return new ResponseEntity<>(stateAssemblyService.getTable(), HttpStatus.OK);
    }


    @GetMapping("/helloWorld")
    public String getHello() {
        return "Hello World";
    }
}
