package com.states.cse416.Controller;

import com.states.cse416.Models.BoxAndWhisker;
import com.states.cse416.Models.EcologicalInference;
import com.states.cse416.Models.Gingles;
import com.states.cse416.Models.enums.ElectionType;
import com.states.cse416.Models.enums.Race;
import com.states.cse416.Models.enums.StateName;
import com.states.cse416.Service.BoxAndWhiskerService;
import com.states.cse416.Service.EcologicalInferenceService;
import com.states.cse416.Service.GinglesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class AnalysisController {

    @Autowired
    private GinglesService ginglesService;

    @Autowired
    private EcologicalInferenceService ecologicalInferenceService;

    @Autowired
    private BoxAndWhiskerService boxAndWhiskerService;

    @GetMapping("/gingles/{state}/{race}")
    public ResponseEntity<List<Gingles>> getGinglesPlot(@PathVariable StateName state, @PathVariable Race race) {
//        return ResponseEntity.ok(ginglesService.getGinglesByStateAndRace(state, race));
        return new ResponseEntity<>(ginglesService.getGinglesByStateAndRace(state, race), HttpStatus.OK);
    }

    @GetMapping("/ecoInference/{state}/{race}")
    public ResponseEntity<List<EcologicalInference>> getEcoInferences(@PathVariable StateName state, @PathVariable Race race) {
        return new ResponseEntity<>(ecologicalInferenceService.getEcologicalInferenceByState(state, race), HttpStatus.OK);
    }

    @GetMapping("/ecoInference/{state}/{race}/{election}")
    public ResponseEntity<List<EcologicalInference>> getEcoInferences(@PathVariable StateName state,
                                                                      @PathVariable Race race,
                                                                      @PathVariable ElectionType election) {
        return new ResponseEntity<>(
                ecologicalInferenceService.getEcologicalInferenceByElectionAndRace(state, race, election),
                HttpStatus.OK
        );
    }

    @GetMapping("/boxWhisker/{state}/{race}")
    public ResponseEntity<List<BoxAndWhisker>> getBoxAndWhisker(@PathVariable StateName state, @PathVariable Race race) {
        return new ResponseEntity<>(
                boxAndWhiskerService.getBoxAndWhiskerByStateAndRace(state, race),
                HttpStatus.OK
        );
    }

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
