package com.states.cse416.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Threshold {
    private double ensembleAvg;
    private double ensembleMax;
    private double[] ensembleOpp;
}
